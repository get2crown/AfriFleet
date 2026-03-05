# backend/models/vehicle.py
from sqlalchemy import Column, Integer, String, Float, Date, Boolean
from .database import Base

class Vehicle(Base):
    __tablename__ = "vehicles"
    
    id = Column(Integer, primary_key=True, index=True)
    vehicle_name = Column(String, nullable=False)
    registration_number = Column(String, unique=True, index=True)
    assigned_driver = Column(String)
    vehicle_type = Column(String)  # Bus, Car, Truck
    current_mileage = Column(Integer, default=0)
    status = Column(String, default="active")  # active, maintenance, out_of_service
    notes = Column(String, nullable=True)
    
    # Insurance and docs
    insurance_expiry = Column(Date, nullable=True)
    license_expiry = Column(Date, nullable=True)
    
    created_at = Column(Date, nullable=True)
