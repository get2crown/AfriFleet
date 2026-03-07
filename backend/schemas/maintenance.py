from pydantic import BaseModel, ConfigDict, field_validator
from typing import List, Optional
from datetime import date

# ---------- Task Schemas ----------
class MaintenanceTaskBase(BaseModel):
    description: str
    quantity: int = 1
    part_name: Optional[str] = None
    cost_estimate: float
    technician: Optional[str] = None
    workshop: Optional[str] = None

class MaintenanceTaskCreate(MaintenanceTaskBase):
    pass

class MaintenanceTaskResponse(MaintenanceTaskBase):
    id: int
    issue_id: int
    is_completed: bool = False
    model_config = ConfigDict(from_attributes=True)

# ---------- Issue Schemas ----------
class MaintenanceIssueBase(BaseModel):
    vehicle_id: int
    observation: str
    issues_identified: str  # stored as a string in DB
    mileage: Optional[int] = None
    priority: str
    color_code: Optional[str] = None
    status: str = "pending"
    approval_status: str = "pending"
    reported_date: date
    completed_date: Optional[date] = None
    follow_up_date: Optional[date] = None
    remarks: Optional[str] = None
    is_longstanding: bool = False

class MaintenanceIssueCreate(MaintenanceIssueBase):
    tasks: List[MaintenanceTaskCreate]

class MaintenanceIssueResponse(MaintenanceIssueBase):
    id: int
    issue_number: Optional[str] = None
    tasks: List[MaintenanceTaskResponse] = []
    # Override to be a list for the API response
    issues_identified: List[str]

    @field_validator('issues_identified', mode='before')
    @classmethod
    def split_issues(cls, v):
        """Convert stored string into a list."""
        if isinstance(v, str):
            # Handle strings that look like list literals, e.g., "['Oil change']"
            if v.startswith('[') and v.endswith(']'):
                import ast
                try:
                    parsed = ast.literal_eval(v)
                    if isinstance(parsed, list):
                        return [str(item).strip() for item in parsed]
                except (SyntaxError, ValueError):
                    pass
            # Fallback: split by commas
            return [item.strip() for item in v.split(',') if item.strip()]
        return v  # if it's already a list, return as-is

    model_config = ConfigDict(from_attributes=True)