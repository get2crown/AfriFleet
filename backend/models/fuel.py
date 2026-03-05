# backend/models/fuel.py
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from .database import Base

class FuelLog(Base):
    __tablename__ = "fuel_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    
    fuel_date = Column(Date)
    fuel_type = Column(String)  # petrol, diesel
    quantity_liters = Column(Float)
    price_per_liter = Column(Float)
    total_cost = Column(Float)
    
    odometer_reading = Column(Integer)
    fuel_station = Column(String)
    receipt_url = Column(String, nullable=True)
    
    notes = Column(String, nullable=True)
