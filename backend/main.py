# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# use package-relative imports so the module can be executed from
# the project root or via ``uvicorn backend.main:app`` without
# requiring the top‑level name to be on sys.path.
from .routers import vehicles, maintenance, fuel, approvals
from .models.database import engine, Base, SessionLocal
from .settings import settings

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Afritech Fleet Management API",
    description="API for managing fleet maintenance, fuel, and approvals",
    version="1.0.0"
)

# Configure CORS (so React can talk to this API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(vehicles.router)
app.include_router(maintenance.router)
app.include_router(fuel.router)
app.include_router(approvals.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to Afritech Fleet Management API",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
def health_check():
    """Verify that the application and database are reachable."""
    try:
        # simple ping via session
        db = SessionLocal()
        db.execute(settings.health_query)
        db.close()
        return {"status": "healthy", "database": "connected"}
    except Exception as exc:
        return {"status": "unhealthy", "error": str(exc)}

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
