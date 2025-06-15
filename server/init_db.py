import os
import sys
from app import app, db

def init_db():
    try:
        # Ensure we're in the correct directory
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        
        # Ensure instance folder exists
        instance_path = os.path.join(os.getcwd(), 'instance')
        os.makedirs(instance_path, exist_ok=True)
        
        with app.app_context():
            print("Dropping all tables...")
            db.drop_all()
            print("Creating all tables...")
            db.create_all()
            print("Database initialized successfully!")
    except Exception as e:
        print(f"Error initializing database: {e}")
        sys.exit(1)

if __name__ == "__main__":
    init_db()