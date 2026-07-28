from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version="1.0.0",
        description="Enterprise LLM Guardrail & Security Gateway",
        openapi_url=f"{settings.API_V1_STR}/openapi.json"
    )

    # Configure Cross-Origin Resource Sharing (CORS) for the frontend
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],  # Adjust to match your Vite frontend URL
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount the v1 API routes
    app.include_router(api_router, prefix=settings.API_V1_STR)

    @app.get("/health", tags=["System Health"])
    async def root_health_check():
        return {
            "status": "healthy",
            "environment": settings.ENVIRONMENT,
            "version": "1.0.0"
        }

    return app

app = create_app()