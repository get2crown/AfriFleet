# backend/schemas/vehicle.py
from pydantic import BaseModel
from typing import Optional
from datetime import date

class VehicleBase(BaseModel):
    vehicle_name: str
    registration_number: str
    assigned_driver: Optional[str] = None
    vehicle_type: Optional[str] = None
    current_mileage: Optional[int] = 0
    status: Optional[str] = "active"
    notes: Optional[str] = None

class VehicleCreate(VehicleBase):
    pass

class Vehicle(VehicleBase):
    id: int
    created_at: Optional[date] = None
    
    class Config:
        from_attributes = True
