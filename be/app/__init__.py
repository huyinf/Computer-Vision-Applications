from flask import Flask
from app.packages.auth.controllers.AuthController import auth_blueprint
from app.packages.face_recognition.controllers.FaceRecognitionController import face_recognition_blueprint
from app.controllers import *
from flask_cors import CORS
from app.config.AppConfig import Config
from app.controllers.hello import index_blueprint
import os
from pathlib import Path

def create_directories():
    """Create necessary directories if they don't exist"""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    directories = [
        os.path.join(base_dir, 'images_tempt'),
        os.path.join(base_dir, 'store_database', 'imgs_database_faces'),
        os.path.join(base_dir, 'logs'),
        os.path.join(base_dir, 'uploads')
    ]
    
    for directory in directories:
        path = Path(directory)
        if not path.exists():
            path.mkdir(parents=True, exist_ok=True)

def create_app():
    # Create necessary directories
    create_directories()
    
    # Initialize Flask app
    app = Flask(__name__)
    
    # Configure app
    app.config['SECRET_KEY'] = Config.SECRET_KEY
    
    # Enable CORS
    CORS(app, supports_credentials=True)
    
    with app.app_context():
        # Index route
        app.register_blueprint(index_blueprint)
    
        # Register Blueprints or other routes if needed
        app.register_blueprint(auth_blueprint, url_prefix='/auth')
        
        app.register_blueprint(face_recognition_blueprint, url_prefix='/face_recognition')
    
    return app
