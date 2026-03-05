from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    # SQLite URL or any other database URL; can be overridden via env
    database_url: str = f"sqlite:///{os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'afritech_fleet.db')}"
    backup_dir: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    # health check settings
    health_query: str = "SELECT 1"

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()
