# In seed_vehicles() function, modify the vehicle creation
# backend/seed.py
import sys
import os
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
import random
import json

from backend.models.database import Base
from backend.models.vehicle import Vehicle
from backend.models.maintenance import MaintenanceIssue, MaintenanceTask
from backend.models.fuel import FuelLog

DATABASE_URL = "sqlite:///./afritech_fleet.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def seed_vehicles():
    print("🌱 Seeding vehicles...")
    # ... (your existing code) ...

def seed_maintenance_issues():
    print("🌱 Seeding maintenance issues...")
    # ...

def seed_fuel_logs():
    print("🌱 Seeding fuel logs...")
    # ...

def seed_all():
    """Run all seeders"""
    print("🚀 Starting database seeding...\n")
    # optionally clear data
    # db.query(MaintenanceTask).delete()
    # db.query(MaintenanceIssue).delete()
    # db.query(FuelLog).delete()
    # db.query(Vehicle).delete()
    # db.commit()
    seed_vehicles()
    seed_maintenance_issues()
    seed_fuel_logs()
    print("\n✨ Database seeding completed!")

if __name__ == "__main__":
    seed_all()