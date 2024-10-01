from werkzeug.security import check_password_hash, generate_password_hash

class Hash:

    def __init__(self):
        pass

    def checkHash(self, pHash, password):
        return check_password_hash(pHash, password)

    def getHash(self, password):
        self.pasHash = generate_password_hash(password)
        return self.pasHash
