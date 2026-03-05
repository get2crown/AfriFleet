# backend/routers/approvals.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from ..models.database import SessionLocal
from ..models.maintenance import MaintenanceIssue

router = APIRouter(prefix="/approvals", tags=["approvals"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_pending_approvals(db: Session = Depends(get_db)):
    """Get all maintenance issues requiring CEO approval"""
    issues = db.query(MaintenanceIssue).filter(
        MaintenanceIssue.requires_ceo_approval == True
    ).all()
    
    result = []
    for issue in issues:
        result.append({
            "id": issue.id,
            "vehicle_id": issue.vehicle_id,
            "vehicle_name": issue.vehicle_name,
            "registration_number": issue.registration_number,
            "reported_date": issue.reported_date.isoformat() if issue.reported_date else None,
            "issues_identified": issue.issues_identified or [],
            "estimated_cost": issue.estimated_cost,
            "priority": issue.priority,
            "status": "pending",
            "requires_ceo_approval": issue.requires_ceo_approval,
            "created_at": issue.created_at.isoformat() if issue.created_at else None,
        })
    return result

@router.get("/pending")
def get_pending_only(db: Session = Depends(get_db)):
    """Get only pending approvals (not yet approved/rejected)"""
    issues = db.query(MaintenanceIssue).filter(
        MaintenanceIssue.requires_ceo_approval == True,
        MaintenanceIssue.approval_status == "pending"
    ).all()
    
    result = []
    for issue in issues:
        result.append({
            "id": issue.id,
            "vehicle_id": issue.vehicle_id,
            "vehicle_name": issue.vehicle_name,
            "registration_number": issue.registration_number,
            "reported_date": issue.reported_date.isoformat() if issue.reported_date else None,
            "issues_identified": issue.issues_identified or [],
            "estimated_cost": issue.estimated_cost,
            "priority": issue.priority,
            "status": "pending",
            "requires_ceo_approval": True,
            "created_at": issue.created_at.isoformat() if issue.created_at else None,
        })
    return result

@router.get("/{issue_id}")
def get_approval_details(issue_id: int, db: Session = Depends(get_db)):
    """Get details of a specific approval request"""
    issue = db.query(MaintenanceIssue).filter(MaintenanceIssue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Approval request not found")
    
    if not issue.requires_ceo_approval:
        raise HTTPException(status_code=400, detail="This issue does not require approval")
    
    return {
        "id": issue.id,
        "vehicle_id": issue.vehicle_id,
        "vehicle_name": issue.vehicle_name,
        "registration_number": issue.registration_number,
        "reported_date": issue.reported_date.isoformat() if issue.reported_date else None,
        "issues_identified": issue.issues_identified or [],
        "estimated_cost": issue.estimated_cost,
        "priority": issue.priority,
        "status": issue.approval_status or "pending",
        "requires_ceo_approval": issue.requires_ceo_approval,
        "created_at": issue.created_at.isoformat() if issue.created_at else None,
    }

@router.post("/{issue_id}/approve")
def approve_request(issue_id: int, approval_data: dict = None, db: Session = Depends(get_db)):
    """Approve a maintenance request"""
    issue = db.query(MaintenanceIssue).filter(MaintenanceIssue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Approval request not found")
    
    if not issue.requires_ceo_approval:
        raise HTTPException(status_code=400, detail="This issue does not require approval")
    
    # Update approval status
    issue.approval_status = "approved"
    issue.approved_at = datetime.now()
    issue.approved_by = approval_data.get("approved_by") if approval_data else "CEO"
    issue.approval_comments = approval_data.get("comments") if approval_data else None
    
    db.commit()
    db.refresh(issue)
    
    return {
        "id": issue.id,
        "status": "approved",
        "message": "Maintenance request approved",
        "approved_at": issue.approved_at.isoformat() if issue.approved_at else None
    }

@router.post("/{issue_id}/reject")
def reject_request(issue_id: int, rejection_data: dict = None, db: Session = Depends(get_db)):
    """Reject a maintenance request"""
    issue = db.query(MaintenanceIssue).filter(MaintenanceIssue.id == issue_id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Approval request not found")
    
    if not issue.requires_ceo_approval:
        raise HTTPException(status_code=400, detail="This issue does not require approval")
    
    # Update approval status
    issue.approval_status = "rejected"
    issue.rejected_at = datetime.now()
    issue.rejection_reason = rejection_data.get("rejection_reason") if rejection_data else "No reason provided"
    issue.rejected_by = rejection_data.get("rejected_by") if rejection_data else "CEO"
    
    db.commit()
    db.refresh(issue)
    
    return {
        "id": issue.id,
        "status": "rejected",
        "message": "Maintenance request rejected",
        "rejected_at": issue.rejected_at.isoformat() if issue.rejected_at else None
    }

@router.get("/status/approved")
def get_approved_requests(db: Session = Depends(get_db)):
    """Get all approved requests"""
    issues = db.query(MaintenanceIssue).filter(
        MaintenanceIssue.requires_ceo_approval == True,
        MaintenanceIssue.approval_status == "approved"
    ).all()
    
    result = []
    for issue in issues:
        result.append({
            "id": issue.id,
            "vehicle_name": issue.vehicle_name,
            "estimated_cost": issue.estimated_cost,
            "status": "approved",
            "priority": issue.priority,
            "approved_at": issue.approved_at.isoformat() if hasattr(issue, 'approved_at') and issue.approved_at else None,
        })
    return result

@router.get("/status/rejected")
def get_rejected_requests(db: Session = Depends(get_db)):
    """Get all rejected requests"""
    issues = db.query(MaintenanceIssue).filter(
        MaintenanceIssue.requires_ceo_approval == True,
        MaintenanceIssue.approval_status == "rejected"
    ).all()
    
    result = []
    for issue in issues:
        result.append({
            "id": issue.id,
            "vehicle_name": issue.vehicle_name,
            "estimated_cost": issue.estimated_cost,
            "status": "rejected",
            "priority": issue.priority,
            "rejected_at": issue.rejected_at.isoformat() if hasattr(issue, 'rejected_at') and issue.rejected_at else None,
        })
    return result
