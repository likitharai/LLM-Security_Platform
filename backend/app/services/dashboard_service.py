# backend/dashboard_service.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psutil
import time
import random

app = FastAPI(title="LLM Security Platform API")

# Allow React frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"], # Adjust if your React port is different
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

START_TIME = time.time()

@app.get("/api/health")
async def get_health_status():
    """Returns system health, CPU, and memory usage for the Model Health dashboard."""
    try:
        uptime_seconds = time.time() - START_TIME
        return {
            "status": "Operational",
            "cpu_usage_pct": psutil.cpu_percent(interval=0.1),
            "memory_usage_pct": psutil.virtual_memory().percent,
            "latency_ms": random.randint(35, 55), # Simulated LLM latency
            "uptime_seconds": uptime_seconds,
            "uptime_formatted": "99.98%"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats")
async def get_dashboard_stats():
    """Returns high-level KPI metrics for the Overview dashboard."""
    return {
        "prompts_analyzed": 24892,
        "prompts_trend": "+12.0%",
        "threats_blocked": 1247,
        "threats_trend": "+3.4%",
        "phi_masked": 3681,
        "phi_trend": "-0.2%",
        "avg_latency": 38
    }

@app.get("/api/logs")
async def get_threat_logs():
    """Returns recent threat logs for the Threat Logs page."""
    # In a real app, this would query a database (SQLite/Postgres)
    return [
        {"time": "10:42:18", "source": "Web Portal", "prompt": "Ignore previous instructions...", "detection": "Prompt Injection", "risk": 94, "action": "Blocked"},
        {"time": "10:38:04", "source": "API Gateway", "prompt": "Summarize the record for ID 44821...", "detection": "PHI Exposure", "risk": 76, "action": "Masked"},
    ]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)