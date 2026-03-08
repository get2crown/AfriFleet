# backend/migrate.py
import sqlite3
from pathlib import Path

def run_migrations():
    """Run database migrations to ensure schema is up to date"""
    print("🔄 Running database migrations...")

    # Get database path
    db_path = Path(__file__).parent.parent / 'afritech_fleet.db'
    print(f"📊 Database path: {db_path}")

    if not db_path.exists():
        print("❌ Database file not found. Please start the backend first.")
        return False

    conn = sqlite3.connect(str(db_path))

    try:
        # Check if users table exists
        tables = conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
        table_names = [t[0] for t in tables]
        print(f"📋 Tables found: {table_names}")

        if 'users' not in table_names:
            print("❌ Users table doesn't exist yet. Start the backend first.")
            return False

        # Get existing columns
        cursor = conn.execute("PRAGMA table_info(users)")
        existing_columns = [col[1] for col in cursor.fetchall()]
        print(f"📋 Existing columns in users: {existing_columns}")

        # Define columns to add
        columns = [
            ('hashed_password', 'VARCHAR'),
            ('role', "VARCHAR DEFAULT 'logistics_officer'"),
            ('is_active', 'BOOLEAN DEFAULT 1'),
            ('created_at', 'TIMESTAMP'),
            ('updated_at', 'TIMESTAMP')
        ]

        # Add missing columns
        for col_name, col_def in columns:
            if col_name not in existing_columns:
                try:
                    conn.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_def}")
                    print(f"  ✅ Added column: {col_name}")
                except Exception as e:
                    print(f"  ❌ Error adding {col_name}: {e}")
            else:
                print(f"  ⏭️ Column already exists: {col_name}")

        conn.commit()
        print("✅ Migration completed successfully!")
        return True

    except Exception as e:
        print(f"❌ Error during migration: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()

if __name__ == "__main__":
    # If run directly, execute migrations
    run_migrations()