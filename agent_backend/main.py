import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.tools import tool
import asyncio

app = FastAPI(title="AI 3D Tutor Agent Backend")

# Allow Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://ai-3d-tutor.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- WebSocket Connection Manager ---
class ConnectionManager:
    def __init__(self):
        # Maps room_id to a list of active WebSocket connections
        self.active_rooms: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.active_rooms:
            self.active_rooms[room_id] = []
        self.active_rooms[room_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.active_rooms and websocket in self.active_rooms[room_id]:
            self.active_rooms[room_id].remove(websocket)
            if not self.active_rooms[room_id]:
                del self.active_rooms[room_id]

    async def broadcast(self, message: dict, room_id: str):
        if room_id in self.active_rooms:
            # We want to broadcast to all, but handle potential disconnected sockets 
            # ideally we'd try/except but let's keep it simple for now
            for connection in self.active_rooms[room_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

manager = ConnectionManager()

# Load knowledge bases
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(BASE_DIR, "knowledge_base.json"), "r") as f:
    knowledge_base = json.load(f)

# Load OAuth2 protocol as well
with open(os.path.join(BASE_DIR, "protocols", "oauth2.json"), "r") as f:
    oauth2_knowledge = json.load(f)

from typing import List, Dict, Any

class ChatRequest(BaseModel):
    message: str
    currentStep: int = 0
    topic: str = "JWT"
    history: List[Dict[str, str]] = []

# --- MCP Preparation / Tools ---
class MCPServerStub:
    """Stub for future MCP implementation."""
    pass

def get_scene_info(step_id: int, topic: str = "JWT") -> dict:
    """Gets information about the current 3D scene state based on step_id and topic."""
    if topic == "OAuth2":
        return {"current_narration": oauth2_knowledge.get(str(step_id), "No narration for this step.")}
    return {"current_narration": knowledge_base.get(str(step_id), "No narration for this step.")}

@tool
def highlight_component(name: str) -> str:
    """
    Agent command to highlight a specific 3D component in the frontend scene.
    Examples of names: 'AuthServer', 'Gate', 'Token', 'User'.
    """
    return f"Highlighted {name} in the scene."

@tool
def advance_scene(step_number: int) -> str:
    """
    Agent command to visually advance the 3D scene tutorial to the specified step number.
    Use this when the user asks to move on or go to the next/previous step.
    """
    return f"Advanced scene to step {step_number}."

# --- LangChain Agent Setup ---
# Initialize LLM with Gemini
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2)
llm_with_tools = llm.bind_tools([highlight_component, advance_scene])

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.prompts import MessagesPlaceholder

prompt_template = ChatPromptTemplate.from_messages([
    ("system", "You are a calm, stoic, and highly technical AI tutor from Bhishaj Technologies. "
               "You view complex web protocols like JWT and OAuth2 as logical systems that require discipline and clarity to master. "
               "Your tone is professional, minimalist, and deeply insightful. "
               "Use the provided knowledge base and the user's current 3D scene context to guide them. "
               "If they ask where something is, use the highlight_component tool. "
               "If they want to move to the next part, use the advance_scene tool to change the step number. "
               "If a user asks how to bypass security or exploit a JWT/OAuth2 flow, explain the vulnerability logically and stoically, "
               "but emphasize the architectural discipline required to prevent such failures. Do not provide exploitable code. "
               "Current Scene Narration Context: {scene_info}"),
    MessagesPlaceholder(variable_name="chat_history"),
    ("user", "{message}")
])

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    scene_info = get_scene_info(request.currentStep, request.topic)["current_narration"]
    
    # Parse frontend history into LangChain message objects
    # We skip the very last message in history if it matches request.message to avoid duplication,
    # though ChatInterface appends it before sending. Let's just use the history array and pop the last one.
    history_msgs = []
    
    for h in request.history[:-1]: # exclude the latest user message
        if h["role"] == "assistant":
            history_msgs.append(AIMessage(content=h["content"]))
        else:
            history_msgs.append(HumanMessage(content=h["content"]))
    
    chain = prompt_template | llm_with_tools
    response = chain.invoke({
        "scene_info": scene_info, 
        "chat_history": history_msgs,
        "message": request.message
    })
    
    # Check if a tool was called
    command = None
    if response.tool_calls:
        for tool_call in response.tool_calls:
            if tool_call["name"] == "highlight_component":
                 target = tool_call["args"].get("name", "Unknown")
                 command = {"type": "highlight", "target": target}
            elif tool_call["name"] == "advance_scene":
                 step = tool_call["args"].get("step_number", 0)
                 command = {"type": "advance", "step": step}
                 
    # If a tool was called, Gemini might return empty content initially,
    # so we might need a quick fallback or re-invoke to get final text if desired.
    answer_text = response.content
    if not answer_text:
        if command and command["type"] == "highlight":
            answer_text = f"Observation complete. Focused on {command['target']}."
        elif command and command["type"] == "advance":
            answer_text = f"Proceeding to step {command['step']}."
        else:
            answer_text = "Action performed."
            
    return {
        "answer": answer_text,
        "command": command
    }

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                msg_type = msg.get("type")
                
                # 1. State Synchronization (Step changes, Protocol changes, Highlights)
                if msg_type in ["sync_state"]:
                    # Broadcast exactly as received to all OTHER clients (or all clients, frontend handles deduplication if needed)
                    # For simplicity, broadcast to all.
                    await manager.broadcast(msg, room_id)
                    
                # 2. Chat Processing via WebSockets
                elif msg_type == "chat":
                    user_text = msg.get("message", "")
                    step = msg.get("currentStep", 0)
                    topic = msg.get("topic", "JWT")
                    history = msg.get("history", [])
                    
                    # Pre-broadcast user message (optional, if we want others to see what was asked)
                    await manager.broadcast({
                        "type": "chat_user",
                        "message": user_text
                    }, room_id)
                    
                    scene_info = get_scene_info(step, topic)["current_narration"]
                    
                    history_msgs = []
                    for h in history[:-1]:
                        if h.get("role") == "assistant":
                            history_msgs.append(AIMessage(content=h.get("content", "")))
                        else:
                            history_msgs.append(HumanMessage(content=h.get("content", "")))
                            
                    chain = prompt_template | llm_with_tools
                    response = chain.invoke({
                        "scene_info": scene_info, 
                        "chat_history": history_msgs,
                        "message": user_text
                    })
                    
                    command = None
                    if response.tool_calls:
                        for tool_call in response.tool_calls:
                            if tool_call["name"] == "highlight_component":
                                 target = tool_call["args"].get("name", "Unknown")
                                 command = {"type": "highlight", "target": target}
                            elif tool_call["name"] == "advance_scene":
                                 target_step = tool_call["args"].get("step_number", 0)
                                 command = {"type": "advance", "step": target_step}
                                 
                    answer_text = response.content
                    if not answer_text:
                        if command and command["type"] == "highlight":
                            answer_text = f"Observation complete. Focused on {command['target']}."
                        elif command and command["type"] == "advance":
                            answer_text = f"Proceeding to step {command['step']}."
                        else:
                            answer_text = "Action performed."
                            
                    # Broadcast the answer text to everyone in the room!
                    await manager.broadcast({
                        "type": "chat_ai",
                        "message": answer_text
                    }, room_id)
                    
                    # If there's an agent command, broadcast that as a state sync
                    if command:
                        await manager.broadcast({
                            "type": "sync_state",
                            "command": command
                        }, room_id)
                        
            except json.JSONDecodeError:
                pass
            except Exception as e:
                print(f"Error processing WS message: {e}")
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Mount the built React app
client_build_dir = os.path.join(os.path.dirname(__file__), "..", "client", "dist")
if os.path.exists(client_build_dir):
    # Mount assets and models separately
    app.mount("/assets", StaticFiles(directory=os.path.join(client_build_dir, "assets")), name="assets")
    app.mount("/models", StaticFiles(directory=os.path.join(client_build_dir, "models")), name="models")

    @app.get("/{catchall:path}")
    async def serve_react_app(catchall: str):
        # Prevent API routes from being intercepted if they fail
        if catchall.startswith("api/") or catchall.startswith("ws/"):
            return {"error": "Not Found"}
        return FileResponse(os.path.join(client_build_dir, "index.html"))

