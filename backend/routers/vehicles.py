# backend/routers/vehicles.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

# relative imports keep the package structure intact
from ..models.database import SessionLocal
from ..models.vehicle import Vehicle as VehicleModel
from ..schemas.vehicle import Vehicle, VehicleCreate

router = APIRouter(prefix="/vehicles", tags=["vehicles"])

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[Vehicle])
def get_vehicles(db: Session = Depends(get_db)):
    """Get all vehicles"""
    vehicles = db.query(VehicleModel).all()
    return vehicles

@router.get("/{vehicle_id}", response_model=Vehicle)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    """Get a specific vehicle"""
    vehicle = db.query(VehicleModel).filter(VehicleModel.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle

@router.post("/", response_model=Vehicle)
def create_vehicle(vehicle: VehicleCreate, db: Session = Depends(get_db)):
    """Create a new vehicle"""
    db_vehicle = VehicleModel(**vehicle.dict())
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

@router.put("/{vehicle_id}", response_model=Vehicle)
def update_vehicle(vehicle_id: int, vehicle: VehicleCreate, db: Session = Depends(get_db)):
    """Update a vehicle"""
    db_vehicle = db.query(VehicleModel).filter(VehicleModel.id == vehicle_id).first()
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    for key, value in vehicle.dict().items():
        setattr(db_vehicle, key, value)
    
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    """Delete a vehicle"""
    db_vehicle = db.query(VehicleModel).filter(VehicleModel.id == vehicle_id).first()
    if not db_vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    db.delete(db_vehicle)
    db.commit()
    return {"message": "Vehicle deleted successfully"}
