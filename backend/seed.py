# backend/seed_full.py
import sys
import os
import random
from datetime import datetime, timedelta
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from backend.models.database import Base
from backend.models.vehicle import Vehicle
from backend.models.maintenance import MaintenanceIssue, MaintenanceTask
from backend.models.fuel import FuelLog

# Optional: use Faker for realistic data
try:
    from faker import Faker
    fake = Faker()
    FAKER_AVAILABLE = True
except ImportError:
    FAKER_AVAILABLE = False
    print("⚠️  Faker not installed. Using basic random generators.")

# Database connection
DATABASE_URL = "sqlite:///./afritech_fleet.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

# ---------- Constants ----------
VEHICLE_TYPES = ['Bus', 'Truck', 'Sedan', 'SUV', 'Pickup', 'Van', 'Minibus']
MAKES = ['Toyota', 'Nissan', 'Ford', 'Isuzu', 'Mitsubishi', 'Honda', 'Mazda', 'Hyundai']
MODELS = {
    'Toyota': ['Hiace', 'Corolla', 'Hilux', 'Land Cruiser', 'Camry'],
    'Nissan': ['Patrol', 'Sunny', 'Navara', 'Urvan'],
    'Ford': ['Ranger', 'Transit', 'F-150', 'Everest'],
    'Isuzu': ['NPR', 'NQR', 'D-Max', 'MU-X'],
    'Mitsubishi': ['Canter', 'Pajero', 'L300'],
    'Honda': ['Civic', 'CR-V', 'Accord'],
    'Mazda': ['BT-50', 'CX-5', 'Demio'],
    'Hyundai': ['H-1', 'Santa Fe', 'Tucson']
}
DRIVER_FIRST_NAMES = ['John', 'James', 'Peter', 'Michael', 'David', 'Daniel', 'Paul', 'Mark', 'George', 'Steven',
                      'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah']
DRIVER_LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
FUEL_STATIONS = ['TotalEnergies', 'Shell', 'Mobil', 'Oando', 'ConOil', 'NNPC', 'MRS']
MAINTENANCE_TYPES = [
    ('Oil change', 5000, 15000),
    ('Brake pad replacement', 8000, 25000),
    ('Tire replacement', 15000, 40000),
    ('Battery replacement', 10000, 30000),
    ('Engine tune-up', 12000, 35000),
    ('Transmission service', 20000, 50000),
    ('Air conditioning service', 5000, 20000),
    ('Suspension repair', 15000, 45000),
    ('Electrical system check', 3000, 10000),
    ('Wheel alignment', 2000, 5000),
    ('Fuel system cleaning', 4000, 12000),
    ('Coolant flush', 3000, 8000),
]

# ---------- Helper Functions ----------
def random_date(start_date: datetime, end_date: datetime):
    """Generate a random datetime between start_date and end_date."""
    delta = end_date - start_date
    random_seconds = random.randint(0, int(delta.total_seconds()))
    return start_date + timedelta(seconds=random_seconds)

def generate_registration():
    """Generate a random vehicle registration number (e.g., ABC 123 XY)."""
    letters = ''.join(random.choices('ABCDEFGHJKLMNOPQRSTUVWXYZ', k=3))
    numbers = f"{random.randint(100, 999)}"
    suffix = ''.join(random.choices('ABCDEFGHJKLMNOPQRSTUVWXYZ', k=2))
    return f"{letters} {numbers} {suffix}"

def generate_driver_name():
    if FAKER_AVAILABLE:
        return fake.name()
    else:
        return f"{random.choice(DRIVER_FIRST_NAMES)} {random.choice(DRIVER_LAST_NAMES)}"

def generate_vehicle():
    """Generate a single vehicle with random attributes."""
    make = random.choice(MAKES)
    model = random.choice(MODELS[make])
    vehicle_name = f"{make} {model}"
    reg = generate_registration()
    driver = generate_driver_name() if random.random() > 0.2 else None  # 20% unassigned
    vtype = random.choice(VEHICLE_TYPES)
    mileage = random.randint(5000, 300000)
    status = random.choices(['active', 'maintenance', 'out_of_service'], weights=[0.7, 0.2, 0.1])[0]
    # Insurance and license expiry: random dates in next 6-24 months
    today = datetime.now().date()
    insurance_expiry = today + timedelta(days=random.randint(180, 720))
    license_expiry = today + timedelta(days=random.randint(180, 720))
    return Vehicle(
        vehicle_name=vehicle_name,
        registration_number=reg,
        assigned_driver=driver,
        vehicle_type=vtype,
        current_mileage=mileage,
        status=status,
        insurance_expiry=insurance_expiry,
        license_expiry=license_expiry,
        notes=fake.sentence() if FAKER_AVAILABLE else None
    )

def generate_maintenance_issue(vehicle_id, vehicle_mileage, start_date, end_date):
    """Generate a maintenance issue with 1-4 tasks."""
    issue_date = random_date(start_date, end_date)
    # Issues identified: list of strings
    issues = []
    tasks = []
    num_tasks = random.randint(1, 4)
    selected_types = random.sample(MAINTENANCE_TYPES, num_tasks)
    for maint_type in selected_types:
        desc, min_cost, max_cost = maint_type
        cost = random.randint(min_cost, max_cost)
        tasks.append({
            'description': desc,
            'quantity': random.randint(1, 2),
            'cost_estimate': cost,
            'is_completed': random.choice([True, False])
        })
        issues.append(desc)
    # Priority
    priority = random.choices(['low', 'medium', 'high', 'critical'], weights=[0.3, 0.4, 0.2, 0.1])[0]
    status = random.choices(['pending', 'approved', 'in_progress', 'completed'], weights=[0.2, 0.3, 0.2, 0.3])[0]
    approval_status = 'approved' if status in ['in_progress', 'completed'] else 'pending'
    return {
        'vehicle_id': vehicle_id,
        'observation': f"Driver reported: {', '.join(issues)}",
        'issues_identified': issues,
        'mileage': vehicle_mileage - random.randint(0, 5000),  # approximate at issue time
        'priority': priority,
        'status': status,
        'approval_status': approval_status,
        'reported_date': issue_date.date(),
        'completed_date': issue_date.date() + timedelta(days=random.randint(1, 10)) if status == 'completed' else None,
        'remarks': fake.sentence() if FAKER_AVAILABLE else None,
        'tasks': tasks
    }

def generate_fuel_log(vehicle_id, vehicle_mileage, log_date):
    """Generate a single fuel log."""
    liters = round(random.uniform(20, 150), 1)
    price_per_liter = random.randint(1600, 2000)
    total_cost = liters * price_per_liter
    fuel_type = random.choice(['petrol', 'diesel'])
    station = random.choice(FUEL_STATIONS)
    # Odometer reading should be plausible: between last recorded and current
    # For simplicity, we'll set it to a value less than current mileage
    odo = vehicle_mileage - random.randint(0, 2000)
    return FuelLog(
        vehicle_id=vehicle_id,
        fuel_date=log_date.date(),
        fuel_type=fuel_type,
        quantity_liters=liters,
        price_per_liter=price_per_liter,
        total_cost=total_cost,
        odometer_reading=odo,
        fuel_station=station,
        notes=fake.sentence() if FAKER_AVAILABLE else None
    )

# ---------- Main Seeding Function ----------
def seed_full_database(clear_existing=True):
    print("🚀 Starting full database seeding...")
    if clear_existing:
        print("⚠️  Clearing existing data...")
        db.query(MaintenanceTask).delete()
        db.query(MaintenanceIssue).delete()
        db.query(FuelLog).delete()
        db.query(Vehicle).delete()
        db.commit()
        print("✅ Existing data cleared.")

    # Create 20 vehicles
    vehicles = []
    for _ in range(20):
        v = generate_vehicle()
        db.add(v)
        db.flush()  # to get vehicle.id
        vehicles.append(v)
        print(f"  ➕ Added vehicle: {v.vehicle_name} ({v.registration_number})")

    db.commit()
    print(f"✅ {len(vehicles)} vehicles created.")

    # For each vehicle, create maintenance issues and fuel logs
    today = datetime.now()
    one_year_ago = today - timedelta(days=365)

    for vehicle in vehicles:
        print(f"\n📦 Processing vehicle {vehicle.id}: {vehicle.vehicle_name}")

        # Maintenance issues: between 3 and 10 per vehicle
        num_issues = random.randint(3, 10)
        for _ in range(num_issues):
            issue_data = generate_maintenance_issue(
                vehicle.id,
                vehicle.current_mileage,
                one_year_ago,
                today
            )
            # Create issue
            issue = MaintenanceIssue(
                vehicle_id=issue_data['vehicle_id'],
                observation=issue_data['observation'],
                issues_identified=str(issue_data['issues_identified']),  # store as JSON string
                mileage=issue_data['mileage'],
                priority=issue_data['priority'],
                status=issue_data['status'],
                approval_status=issue_data['approval_status'],
                reported_date=issue_data['reported_date'],
                completed_date=issue_data['completed_date'],
                remarks=issue_data['remarks']
            )
            db.add(issue)
            db.flush()

            # Create tasks
            for task_data in issue_data['tasks']:
                task = MaintenanceTask(
                    issue_id=issue.id,
                    description=task_data['description'],
                    quantity=task_data['quantity'],
                    cost_estimate=task_data['cost_estimate'],
                    is_completed=task_data['is_completed']
                )
                db.add(task)
            print(f"    🛠️ Added maintenance issue with {len(issue_data['tasks'])} tasks")

        # Fuel logs: between 20 and 50 per vehicle
        num_fuel_logs = random.randint(20, 50)
        # Generate random dates spread over the year
        for _ in range(num_fuel_logs):
            log_date = random_date(one_year_ago, today)
            fuel_log = generate_fuel_log(vehicle.id, vehicle.current_mileage, log_date)
            db.add(fuel_log)
        print(f"    ⛽ Added {num_fuel_logs} fuel logs")

        db.commit()

    print("\n✨ Full database seeding completed!")
    print(f"📊 Summary:")
    print(f"  Vehicles: {db.query(Vehicle).count()}")
    print(f"  Maintenance Issues: {db.query(MaintenanceIssue).count()}")
    print(f"  Maintenance Tasks: {db.query(MaintenanceTask).count()}")
    print(f"  Fuel Logs: {db.query(FuelLog).count()}")

if __name__ == "__main__":
    seed_full_database(clear_existing=True)