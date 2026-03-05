# backend/schemas/maintenance.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import date

class MaintenanceTaskBase(BaseModel):
    description: str
    quantity: int = 1
    part_name: Optional[str] = None
    cost_estimate: float
    technician: Optional[str] = None
    workshop: Optional[str] = None

class MaintenanceTaskCreate(MaintenanceTaskBase):
    pass

class MaintenanceTask(MaintenanceTaskBase):
    id: int
    issue_id: int
    is_completed: bool
    
    class Config:
        from_attributes = True

class MaintenanceIssueBase(BaseModel):
    vehicle_id: int
    observation: str
    issues_identified: List[str]
    mileage: Optional[int] = None
    priority: str
    color_code: Optional[str] = None
    remarks: Optional[str] = None
    follow_up_date: Optional[date] = None

class MaintenanceIssueCreate(MaintenanceIssueBase):
    tasks: List[MaintenanceTaskCreate]

class MaintenanceIssue(MaintenanceIssueBase):
    id: int
    issue_number: str
    status: str
    approval_status: str
    reported_date: date
    completed_date: Optional[date] = None
    is_longstanding: bool
    tasks: List[MaintenanceTask] = []
    
    class Config:
        from_attributes = True
