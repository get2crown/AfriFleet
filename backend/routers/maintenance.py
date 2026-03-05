# backend/routers/maintenance.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..models.database import SessionLocal
from ..models.maintenance import MaintenanceIssue, MaintenanceTask
from ..schemas.maintenance import MaintenanceIssueCreate

router = APIRouter(prefix="/maintenance", tags=["maintenance"])

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[object])
def get_maintenance_issues(db: Session = Depends(get_db)):
    issues = db.query(MaintenanceIssue).all()
    return issues

@router.post("/", status_code=201)
def create_maintenance_issue(issue: MaintenanceIssueCreate, db: Session = Depends(get_db)):
    # Create issue (exclude tasks for now)
    db_issue = MaintenanceIssue(
        issue_number=getattr(issue, 'issue_number', None),
        vehicle_id=issue.vehicle_id,
        observation=issue.observation,
        issues_identified=','.join(issue.issues_identified) if isinstance(issue.issues_identified, list) else issue.issues_identified,
        mileage=issue.mileage,
        priority=issue.priority,
        color_code=getattr(issue, 'color_code', None),
        status=getattr(issue, 'status', 'pending'),
        approval_status=getattr(issue, 'approval_status', 'pending'),
        reported_date=getattr(issue, 'reported_date', None),
        completed_date=getattr(issue, 'completed_date', None),
        follow_up_date=issue.follow_up_date,
        remarks=issue.remarks,
        is_longstanding=getattr(issue, 'is_longstanding', False),
    )
    db.add(db_issue)
    db.flush()  # get id

    for task in issue.tasks:
        db_task = MaintenanceTask(
            issue_id=db_issue.id,
            description=task.description,
            quantity=task.quantity,
            part_name=task.part_name,
            cost_estimate=task.cost_estimate,
            technician=task.technician,
            workshop=task.workshop,
        )
        db.add(db_task)

    db.commit()
    db.refresh(db_issue)
    return {"message": "Issue created", "id": db_issue.id}
