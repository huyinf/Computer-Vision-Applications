import os
from pathlib import Path

def create_directory_if_not_exists(directory_path):
    """
    Create a directory if it doesn't exist.
    
    Args:
        directory_path (str): Path to the directory to create
    """
    path = Path(directory_path)
    if not path.exists():
        path.mkdir(parents=True, exist_ok=True)
        print(f"Created directory: {directory_path}")
    else:
        print(f"Directory already exists: {directory_path}")

def main():
    # Base directory for the application
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # List of directories to create
    directories = [
        os.path.join(base_dir, 'images_tempt'),
        os.path.join(base_dir, 'store_database', 'imgs_database_faces'),
        os.path.join(base_dir, 'logs'),
        os.path.join(base_dir, 'uploads')
    ]
    
    # Create each directory
    for directory in directories:
        create_directory_if_not_exists(directory)
    
    print("All directories have been checked/created successfully!")

if __name__ == "__main__":
    main() 