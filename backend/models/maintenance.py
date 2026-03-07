# backend/models/maintenance.py
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Boolean, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class MaintenanceIssue(Base):
    __tablename__ = "maintenance_issues"
    
    id = Column(Integer, primary_key=True, index=True)
    issue_number = Column(String, unique=True)  # e.g., "REQ-2025-11-001"
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    vehicle_name = Column(String, nullable=True)
    registration_number = Column(String, nullable=True)
    tasks = relationship("MaintenanceTask", back_populates="issue", cascade="all, delete-orphan")

    
    # From your Excel
    observation = Column(Text)
    issues_identified = Column(String)  # We'll store as JSON string
    mileage = Column(Integer)
    
    # Priority and status
    priority = Column(String)  # low, medium, high, critical
    color_code = Column(String)  # Red, Orange, Green
    status = Column(String, default="pending")  # pending, approved, in_progress, completed
    approval_status = Column(String, default="pending")
    
    # Approval fields
    requires_ceo_approval = Column(Boolean, default=False)
    approved_by = Column(String, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    approval_comments = Column(Text, nullable=True)
    rejected_by = Column(String, nullable=True)
    rejected_at = Column(DateTime, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    
    # Dates
    reported_date = Column(Date)
    completed_date = Column(Date, nullable=True)
    follow_up_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    
    # Financial
    estimated_cost = Column(Float, default=0)
    actual_cost = Column(Float, nullable=True)
    
    # Remarks from Excel
    remarks = Column(Text)
    is_longstanding = Column(Boolean, default=False)
    
    # Relationships
    vehicle = relationship("Vehicle")
    tasks = relationship("MaintenanceTask", back_populates="issue")

class MaintenanceTask(Base):
    __tablename__ = "maintenance_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    issue_id = Column(Integer, ForeignKey("maintenance_issues.id"))
    issue = relationship("MaintenanceIssue", back_populates="tasks")
    # From your Excel line items
    description = Column(String)
    quantity = Column(Integer, default=1)
    part_name = Column(String, nullable=True)
    cost_estimate = Column(Float)
    actual_cost = Column(Float, nullable=True)
    
    # Assignment
    technician = Column(String, nullable=True)
    workshop = Column(String, nullable=True)
    
    # Status
    action_taken = Column(Text, nullable=True)
    is_completed = Column(Boolean, default=False)
    completion_date = Column(Date, nullable=True)
    
    # Relationships
    issue = relationship("MaintenanceIssue", back_populates="tasks")
