from face_recognition import load_image_file, face_encodings, compare_faces
import numpy as np
import cv2
import base64


def face_auth(user_model, captured_face_image):
    
    # Retrieve all users and their stored face images
    users = user_model.get_all_users_with_faces()
    
    # Load the captured face image
    if ',' in captured_face_image:
        # Split the prefix "data:image/jpeg;base64," to get base64 data
        header, encoded = captured_face_image.split(',', 1)
        
        # Decode base64 to bytes
        captured_image_bytes = base64.b64decode(encoded)  
        captured_face_image = np.frombuffer(captured_image_bytes, np.uint8)
        captured_face_image = cv2.imdecode(captured_face_image, cv2.IMREAD_COLOR)
    
    # Get face encodings for the captured image
    captured_face_encodings = face_encodings(captured_face_image)

    if len(captured_face_encodings) == 0:
        print("No faces found in the captured image.")
        return False, None

    for user in users:
        stored_face_image_binary = user['face_image']  # Adjust based on your user model structure
        stored_face_image = np.frombuffer(stored_face_image_binary, np.uint8)
        stored_face_image = cv2.imdecode(stored_face_image, cv2.IMREAD_COLOR)

        # Get face encodings for the stored image
        stored_face_encodings = face_encodings(stored_face_image)

        if len(stored_face_encodings) > 0:
            # Compare the captured face with the stored face
            match = compare_faces([stored_face_encodings[0]], captured_face_encodings[0])
            if match[0]:  # If there is a match
                return True, user['email']  # Return True and the user's email

    return False, None  # No match found
