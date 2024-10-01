from flask import request, jsonify
import bcrypt
import jwt
import datetime
from app import app
from app.models.user_model import User
from app.packages.auth.services.face_recognition_service import face_auth
from app.config.Database import get_db

db = get_db()
user_model = User(db)

SECRET_KEY = 'huyinf'

# Register function
@app.route('/user/register', methods=['POST'])
def register():
    data = request.get_json()
    
    print('data: ',data)


    # Check for missing fields
    if not all([data.get('fname'), data.get('lname'), data.get('email'), data.get('password')]):
        return jsonify({"message": "All fields (fname, lname, email, password) are required"}), 400

    # Check if user already exists
    if user_model.find_by_email(data['email']):
        return jsonify({"message": "Email already in use"}), 409

    # Create new user with optional face data
    face_image = data.get('faceImage')  # Optional field for face auth
    user = user_model.create_user(data['fname'], data['lname'], data['email'], data['password'], face_image)

    
    return jsonify({
        "message": "User registered successfully",
        "user": {
            "fname": user['fname'],
            "lname": user['lname'],
            "email": user['email']
            }
        }), 201


# Login function
@app.route('/user/login', methods=['POST'])
def login():
    data = request.get_json()
    user = user_model.find_by_email(data['email'])

    if not user:
        return jsonify({"message": "User not found"}), 404

    if not user_model.check_password(user['password'], data['password']):
        return jsonify({"message": "Invalid credentials"}), 401

    # Create JWT token
    token = jwt.encode({
        'user_id': str(user['_id']),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({"message": "Login successful", "token": token}), 200

# Login with face

@app.route('/user/login-face', methods=['POST'])
def loginFace():
    data = request.get_json()
    
    # Check if the captured face image is provided
    if not data.get('faceImage'):
        return jsonify({"message": "Captured face image is required"}), 400

    captured_face_image = data['faceImage']

    print('Received captured face image')

    # Perform face authentication
    # This function needs to identify the user based on the captured face image
    is_authenticated, email = face_auth(user_model, captured_face_image)

    if not is_authenticated:
        return jsonify({"message": "Face authentication failed"}), 401

    # If authentication is successful, retrieve the user
    user = user_model.find_by_email(email)
    
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Create JWT token
    token = jwt.encode({
        'user_id': str(user['_id']),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({"message": "Face authentication successful", "token": token}), 200
