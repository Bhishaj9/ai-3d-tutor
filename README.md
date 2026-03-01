---
title: Ai 3d Tutor
emoji: 👁
colorFrom: blue
colorTo: blue
sdk: docker
pinned: false
---

# AI 3D Tutor

By **Bhishaj Technologies**

*Visualize the invisible. A "Cyber-Stoic" approach to mastering web protocols.*

---

## Executive Summary

Abstract web protocols—authentication flows, token exchanges, encrypted payloads—often exist as "black boxes" in the minds of developers. Traditional learning relies on static documentation and complex diagrams, leaving a gap between theoretical knowledge and structural intuition.

The **AI 3D Tutor** replaces the abstract with a tangible, cinematic reality. By merging a highly stylized, spatial 3D visualization with an intelligent, context-aware "Stoic Technician" AI agent, we provide a collaborative educational platform. It is not just a tutorial; it is an orchestrator of learning, actively physically manipulating the 3D environment based on natural language interaction, ensuring deep structural comprehension.

---

## Visual Showcase

### Architecture Overview
*(Architecture Diagram Placeholder: Insert High-Level Architecture Diagram Here)*

### Live Demo
*(Demo Video Placeholder: Insert YouTube/Loom Link or GIF Here)*

---

## Key Features

- **Agentic Mentorship:** Meet the "Stoic Technician." A context-aware guide with multi-turn memory designed to dissect complex protocols and deliver deep, technical insights with minimalist clarity.
- **Spatial Orchestration (WebMCP):** The AI mentor transcends text. It utilizes sophisticated tool-calling to physically drive the narrative—highlighting specific architectural components and advancing the 3D scene step-by-step based on your conversational input.
- **Multi-Protocol Support:** Support for deep, interactive visualizations of both foundational **JWT Authentication** and the rigorous **OAuth2 Authorization Code Flow** (including precise code exchange animations).
- **Real-Time Multiplayer:** Collaborative learning powered by WebSockets. Instantly generated session rooms synchronize the scene state, chat history, and animations across all connected participants simultaneously. 
- **The Payload Inspector:** A stunning, glassmorphic 3D spatial UI that dynamically floats in front of the Token, decoding and visualizing the inner workings of headers, payloads, and cryptographic signatures in true real-time.

---

## Technology Stack

An elegant synergy of graphical fidelity, real-time networking, and agentic intelligence:

### Frontend
- **React 19 & Vite:** Delivering lightning-fast updates and modern declarative programming.
- **Three.js & React Three Fiber (@react-three/drei):** High-performance WebGL graphics rendering.
- **Draco Compression:** Heavily optimized `.glb` models guaranteeing a smooth, premium cinematic experience without network bottlenecks.

### Backend
- **Python FastAPI & Uvicorn:** A high-speed, asynchronous execution layer securely routing the logic.
- **WebSockets:** Underpinning the real-time, low-latency multiplayer architecture.

### AI Layer
- **LangChain & Gemini API (`langchain-google-genai`):** Fueling the reasoning, multi-turn memory, and semantic context of the Stoic Technician.
- **WebMCP Integration:** Providing the robust functional interface for the AI to manipulate the 3D domain.

---

## Getting Started

### 1. The Agent Backend (Python)

Navigate to the backend directory and install the necessary intelligence logic:

```bash
cd agent_backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

Start the FastAPI server (runs on `http://localhost:8000`):

```bash
uvicorn main:app --reload
```

### 2. The Client Frontend (React)

Navigate to the client directory to initialize the spatial environment:

```bash
cd client
npm install
npm run dev
```

Visit the designated local host address (typically `http://localhost:5173`) to enter the Sandbox.

---

## Architecture Deep-Dive

The system architecture is strictly decoupled, representing a distinct separation between rendering and reasoning:

1. **The Spatial View (Client):** The React frontend is entirely "dumb" regarding AI logic. It exclusively manages WebGL rendering, Draco model decoding, and cinematic camera interpolation. It listens to a persistent WebSocket stream for "State" and "Highlight" overrides.
2. **The Logic Layer (Backend):** The FastAPI backend acts as the source of truth for the room. All chat prompts are routed to LangChain. The Stoic Technician analyzes the current spatial state (step, selected protocol, and history) and makes structural decisions. 
3. **The WebMCP Bridge:** When the AI decides the user should focus on the Authorization Server, it calls the `highlight_component` tool. FastAPI captures this execution, packages it as a `sync_state` WebSocket payload, and broadcasts it. The React client interprets this payload, instantly driving the camera and material emission to guide the user's eye.

---

*Designed and engineered by Bhishaj Technologies.*

Check out the configuration reference at https://huggingface.co/docs/hub/spaces-config-reference
