# backend/routers/maintenance.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List

from backend.models.database import SessionLocal
from backend.models.maintenance import MaintenanceIssue, MaintenanceTask
from backend.schemas.maintenance import (
    MaintenanceIssueCreate,
    MaintenanceIssueResponse,
    MaintenanceTaskCreate,
)

router = APIRouter(prefix="/maintenance", tags=["maintenance"])

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[MaintenanceIssueResponse])
def get_maintenance_issues(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    issues = (
        db.query(MaintenanceIssue)
        .options(joinedload(MaintenanceIssue.tasks))
        .offset(skip)
        .limit(limit)
        .all()
    )
    return issues

@router.get("/{issue_id}", response_model=MaintenanceIssueResponse)
def get_maintenance_issue(issue_id: int, db: Session = Depends(get_db)):
    issue = (
        db.query(MaintenanceIssue)
        .options(joinedload(MaintenanceIssue.tasks))
        .filter(MaintenanceIssue.id == issue_id)
        .first()
    )
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    return issue

@router.post("/", status_code=201)
def create_maintenance_issue(
    issue: MaintenanceIssueCreate,
    db: Session = Depends(get_db)
):
    # Convert issues_identified list to comma-separated string for storage
    issues_identified_str = (
        ",".join(issue.issues_identified)
        if isinstance(issue.issues_identified, list)
        else issue.issues_identified
    )

    db_issue = MaintenanceIssue(
        vehicle_id=issue.vehicle_id,
        observation=issue.observation,
        issues_identified=issues_identified_str,
        mileage=issue.mileage,
        priority=issue.priority,
        color_code=issue.color_code,
        status=issue.status,
        approval_status=issue.approval_status,
        reported_date=issue.reported_date,
        completed_date=issue.completed_date,
        follow_up_date=issue.follow_up_date,
        remarks=issue.remarks,
        is_longstanding=issue.is_longstanding,
    )
    db.add(db_issue)
    db.flush()

    for task_data in issue.tasks:
        db_task = MaintenanceTask(
            issue_id=db_issue.id,
            description=task_data.description,
            quantity=task_data.quantity,
            part_name=task_data.part_name,
            cost_estimate=task_data.cost_estimate,
            technician=task_data.technician,
            workshop=task_data.workshop,
        )
        db.add(db_task)

    db.commit()
    db.refresh(db_issue)
    return {"message": "Issue created", "id": db_issue.id}