# backend/routers/fuel.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from ..models.database import SessionLocal
from ..models.fuel import FuelLog
from ..models.vehicle import Vehicle

router = APIRouter(prefix="/fuel", tags=["fuel"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_all_fuel_logs(db: Session = Depends(get_db)):
    """Get all fuel logs with vehicle information"""
    logs = db.query(FuelLog).all()
    result = []
    for log in logs:
        vehicle = db.query(Vehicle).filter(Vehicle.id == log.vehicle_id).first()
        result.append({
            "id": log.id,
            "vehicle_id": log.vehicle_id,
            "vehicle_name": vehicle.vehicle_name if vehicle else "Unknown",
            "registration_number": vehicle.registration_number if vehicle else "Unknown",
            "fuel_date": log.fuel_date.isoformat() if log.fuel_date else None,
            "fuel_type": log.fuel_type,
            "quantity_liters": log.quantity_liters,
            "price_per_liter": log.price_per_liter,
            "total_cost": log.total_cost,
            "odometer_reading": log.odometer_reading,
            "fuel_station": log.fuel_station,
            "receipt_url": log.receipt_url,
            "notes": log.notes,
        })
    return result

@router.get("/{fuel_id}")
def get_fuel_log(fuel_id: int, db: Session = Depends(get_db)):
    """Get a specific fuel log"""
    log = db.query(FuelLog).filter(FuelLog.id == fuel_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Fuel log not found")
    
    vehicle = db.query(Vehicle).filter(Vehicle.id == log.vehicle_id).first()
    return {
        "id": log.id,
        "vehicle_id": log.vehicle_id,
        "vehicle_name": vehicle.vehicle_name if vehicle else "Unknown",
        "registration_number": vehicle.registration_number if vehicle else "Unknown",
        "fuel_date": log.fuel_date.isoformat() if log.fuel_date else None,
        "fuel_type": log.fuel_type,
        "quantity_liters": log.quantity_liters,
        "price_per_liter": log.price_per_liter,
        "total_cost": log.total_cost,
        "odometer_reading": log.odometer_reading,
        "fuel_station": log.fuel_station,
        "receipt_url": log.receipt_url,
        "notes": log.notes,
    }

@router.post("/")
def create_fuel_log(fuel_data: dict, db: Session = Depends(get_db)):
    """Create a new fuel log"""
    vehicle = db.query(Vehicle).filter(Vehicle.id == fuel_data.get("vehicle_id")).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    # Create fuel log
    new_log = FuelLog(
        vehicle_id=fuel_data.get("vehicle_id"),
        fuel_date=datetime.fromisoformat(fuel_data.get("fuel_date")).date() if fuel_data.get("fuel_date") else None,
        fuel_type=fuel_data.get("fuel_type"),
        quantity_liters=fuel_data.get("quantity_liters"),
        price_per_liter=fuel_data.get("price_per_liter"),
        total_cost=fuel_data.get("quantity_liters", 0) * fuel_data.get("price_per_liter", 0),
        odometer_reading=fuel_data.get("odometer_reading"),
        fuel_station=fuel_data.get("fuel_station"),
        receipt_url=fuel_data.get("receipt_url"),
        notes=fuel_data.get("notes"),
    )
    
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    
    return {
        "id": new_log.id,
        "vehicle_id": new_log.vehicle_id,
        "vehicle_name": vehicle.vehicle_name,
        "message": "Fuel log created successfully"
    }

@router.put("/{fuel_id}")
def update_fuel_log(fuel_id: int, fuel_data: dict, db: Session = Depends(get_db)):
    """Update a fuel log"""
    log = db.query(FuelLog).filter(FuelLog.id == fuel_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Fuel log not found")
    
    # Update fields
    if "fuel_date" in fuel_data:
        log.fuel_date = datetime.fromisoformat(fuel_data["fuel_date"]).date()
    if "fuel_type" in fuel_data:
        log.fuel_type = fuel_data["fuel_type"]
    if "quantity_liters" in fuel_data:
        log.quantity_liters = fuel_data["quantity_liters"]
    if "price_per_liter" in fuel_data:
        log.price_per_liter = fuel_data["price_per_liter"]
    if "odometer_reading" in fuel_data:
        log.odometer_reading = fuel_data["odometer_reading"]
    if "fuel_station" in fuel_data:
        log.fuel_station = fuel_data["fuel_station"]
    if "notes" in fuel_data:
        log.notes = fuel_data["notes"]
    
    # Recalculate total cost
    log.total_cost = log.quantity_liters * log.price_per_liter
    
    db.commit()
    db.refresh(log)
    return {"id": log.id, "message": "Fuel log updated successfully"}

@router.delete("/{fuel_id}")
def delete_fuel_log(fuel_id: int, db: Session = Depends(get_db)):
    """Delete a fuel log"""
    log = db.query(FuelLog).filter(FuelLog.id == fuel_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Fuel log not found")
    
    db.delete(log)
    db.commit()
    return {"message": "Fuel log deleted successfully"}

@router.get("/vehicle/{vehicle_id}")
def get_vehicle_fuel_logs(vehicle_id: int, db: Session = Depends(get_db)):
    """Get all fuel logs for a specific vehicle"""
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    logs = db.query(FuelLog).filter(FuelLog.vehicle_id == vehicle_id).all()
    result = []
    for log in logs:
        result.append({
            "id": log.id,
            "vehicle_id": log.vehicle_id,
            "vehicle_name": vehicle.vehicle_name,
            "registration_number": vehicle.registration_number,
            "fuel_date": log.fuel_date.isoformat() if log.fuel_date else None,
            "fuel_type": log.fuel_type,
            "quantity_liters": log.quantity_liters,
            "price_per_liter": log.price_per_liter,
            "total_cost": log.total_cost,
            "odometer_reading": log.odometer_reading,
            "fuel_station": log.fuel_station,
        })
    return result
