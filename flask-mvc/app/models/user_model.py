import base64
import numpy as np
import cv2
from bson.binary import Binary
from app.config.Hash import *

class User:
    def __init__(self, db):
        self.collection = db['users']  # Collection name
    
    def create_user(self, fname, lname, email, password, face_image=None):
        hash_util = Hash()

        hashed_password = hash_util.getHash(password)
        
        face_image_binary = None
        
        if face_image:
            print('Received face_image:', face_image)  # Check input
            if ',' in face_image:
                # Split the prefix "data:image/jpeg;base64," to get base64 data
                header, encoded = face_image.split(',', 1)
                
                # Decode base64 to bytes
                image_bytes = base64.b64decode(encoded)  
                face_image_binary = Binary(image_bytes)  # Store as binary
                
                print('Binary encoding successfully:', face_image_binary is not None)  # Debugging success check
            else:
                print('Invalid face_image format, missing comma')
            
        # Create user document
        user = {
            "fname": fname,
            "lname": lname,
            "email": email,
            "password": hashed_password,
            "face_image": face_image_binary  # Store face image as binary if provided
        }
        
        # Insert the user document into the database
        self.collection.insert_one(user)
        return user

    def find_by_email(self, email):
        return self.collection.find_one({"email": email})

    def check_password(self, hashed_password, password):
        hash_util = Hash()
        return hash_util.checkHash(pHash=hashed_password, password=password)

    def get_face_image(self, email):
        """Retrieve the face image for a user by email."""
        user = self.find_by_email(email)
        if user and 'face_image' in user:
            return user['face_image']
        return None

    def get_all_users_with_faces(self):
        """Retrieve all users who have face images stored in the database."""
        users_with_faces = []
        users = self.collection.find({"face_image": {"$ne": None}})  # Find users with a non-null face_image

        for user in users:
            users_with_faces.append({
                "email": user['email'],
                "face_image": user['face_image']  # Return email and face image binary
            })
        
        return users_with_faces
