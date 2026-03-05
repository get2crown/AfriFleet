# No database server needed - just pure Python!

# 1. Install SQLite support (already in Python!)
# No installation needed!

# 2. Create a test file sqlite_test.py
import sqlite3
import pandas as pd

# Create database (just a file)
conn = sqlite3.connect('afritech_fleet.db')

# Create tables
conn.execute('''
    CREATE TABLE IF NOT EXISTS vehicles (
        id INTEGER PRIMARY KEY,
        vehicle_name TEXT,
        registration_number TEXT UNIQUE,
        assigned_driver TEXT
    )
''')

# Insert sample data from your Excel
vehicles = [
    ('Toyota Bus', 'MUS 999 YA', 'Mr. Luke'),
    ('Kia Cerato', 'LND501GC', 'Umar/Deji'),
    ('Toyota Bus', 'MUS 32 YF', 'Mr. Edema'),
    ('Daihatsu Hijet', 'ABJ 301 KL', 'Mr. Ahmed'),
    ('Hummer H2', 'LAS 201 XY', 'Chief Adeyemi'),
    ('Toyota Hiace', 'EKO 456 BC', 'Mr. Okafor'),
    ('Honda Civic', 'IBD 789 AG', 'Ms. Nneka'),
    ('Mercedes Sprinter', 'KAD 112 FG', 'Mr. Bello'),
    ('Ford Transit', 'JOS 334 MN', 'Mr. Chukwu'),
    ('Toyota Corolla', 'BNU 556 OP', 'Ms. Zainab'),
    ('Volkswagen Transporter', 'PH 778 QR', 'Mr. Emmanuella'),
    ('Nissan Urvan', 'UYO 990 ST', 'Captain Oluwaseun'),
    ('Peugeot 504', 'GWG 221 UV', 'Mr. Musa'),
    ('Mitsubishi Canter', 'MAK 443 WX', 'Mr. Kunle'),
    ('Toyota Avensis', 'KN 665 YZ', 'Ms. Fatimah')
]

conn.executemany('INSERT OR IGNORE INTO vehicles (vehicle_name, registration_number, assigned_driver) VALUES (?, ?, ?)', vehicles)
conn.commit()

# Query the data
df = pd.read_sql_query("SELECT * FROM vehicles", conn)
print("Vehicles in database:")
print(df)

conn.close()
print("✅ SQLite database created successfully!")