#Flask MVC

__author__ = "Vo Hoai Viet"
__version__ = "1.0"
__email__ = "vhviet@fit.hcmus.edu.vn"
import os
from app import app

if __name__ == '__main__':
   

    os.environ['JWT_SECRET_KEY'] = 'huyinf'

    app.run(host="localhost", port=8080, debug=True)
