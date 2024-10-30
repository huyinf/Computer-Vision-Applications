from flask import Flask
from flask_cors import CORS

app = Flask("app")
CORS(app)

from app.controllers import *
from app.packages.auth.controllers import auth_controller