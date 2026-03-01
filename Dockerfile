# Build the React Frontend
FROM node:20-alpine as frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Build the Python FastAPI Backend
FROM python:3.10-slim
WORKDIR /app

# Upgrade pip and install requirements
COPY agent_backend/requirements.txt ./agent_backend/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r agent_backend/requirements.txt

# Copy the backend code and knowledge base
COPY agent_backend/ ./agent_backend/

# Copy the built React app from the frontend builder stage
COPY --from=frontend-builder /app/client/dist ./client/dist

# Expose port 7860 as required by Hugging Face Spaces
EXPOSE 7860

# Set environment variables for production
ENV HOST=0.0.0.0
ENV PORT=7860

# Start Uvicorn
CMD ["uvicorn", "agent_backend.main:app", "--host", "0.0.0.0", "--port", "7860"]
