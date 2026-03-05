# backend/models/database.py
from sqlalchemy import create_engine, Column, Integer, String, Float, Date, Text, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

from ..settings import settings

# database URL is now controlled by environment; fallback to default in settings
DATABASE_URL = settings.database_url

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # Needed for SQLite
)

# Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()
