import sys
import os
from pathlib import Path
import bcrypt

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.models.database import Base
from backend.models.user import User

# Database connection
DATABASE_URL = "sqlite:///./afritech_fleet.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def hash_password(password):
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password, hashed_password):
    """Verify a password against its hash"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_initial_users():
    """Create initial user accounts for testing"""
    print("👤 Creating initial users...")
    
    # First, create the users table if it doesn't exist
    Base.metadata.create_all(bind=engine)
    
    users = [
        {
            "email": "admin@afritech.com",
            "username": "admin",
            "full_name": "System Administrator",
            "password": "admin123",
            "role": "admin"
        },
        {
            "email": "ceo@afritech.com",
            "username": "ceo",
            "full_name": "Ahmed S.",
            "password": "ceo123",
            "role": "ceo"
        },
        {
            "email": "fleet@afritech.com",
            "username": "fleet_manager",
            "full_name": "Fleet Manager",
            "password": "fleet123",
            "role": "fleet_manager"
        },
        {
            "email": "logistics@afritech.com",
            "username": "logistics",
            "full_name": "Hameed Ayodeji",
            "password": "logistics123",
            "role": "logistics_officer"
        },
        {
            "email": "tech@afritech.com",
            "username": "technician",
            "full_name": "Workshop Technician",
            "password": "tech123",
            "role": "technician"
        }
    ]
    
    created_count = 0
    skipped_count = 0
    
    for user_data in users:
        # Check if user already exists
        existing = db.query(User).filter(
            (User.username == user_data["username"]) | (User.email == user_data["email"])
        ).first()
        
        if not existing:
            # Hash the password using bcrypt
            hashed_password = hash_password(user_data["password"])
            
            # Create new user
            user = User(
                email=user_data["email"],
                username=user_data["username"],
                full_name=user_data["full_name"],
                hashed_password=hashed_password,
                role=user_data["role"],
                is_active=True
            )
            db.add(user)
            print(f"  ✅ Created: {user_data['username']} ({user_data['role']})")
            created_count += 1
        else:
            print(f"  ⏭️ Already exists: {user_data['username']}")
            skipped_count += 1
    
    db.commit()
    print(f"\n✅ Users seeded successfully! Created: {created_count}, Skipped: {skipped_count}")

if __name__ == "__main__":
    create_initial_users()
# "@ | Out-File -FilePath backend/seed_users.py -Encoding UTF8

# Write-Host "✅ Updated seed_users.py to use bcrypt directly" -ForegroundColor Green