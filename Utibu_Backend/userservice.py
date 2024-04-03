from models import User
from flask_jwt_extended import create_access_token
from create_app import bcrypt

class UserService:
    @staticmethod
    def check_existing_user(email):
        """
        Check if a user with the given email already exists.
        :param email: Email to check
        :return: True if user already exists, False otherwise
        """
        existing_email = User.query.filter_by(email=email).first()
        return existing_email is not None

    @staticmethod
    def authenticate_user(email, password):
        """
        Authenticate user with the given email and password.
        :param email: Email of the user
        :param password: Password of the user
        :return: User object if authentication is successful, None otherwise
        """
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            return user
        return None

    @staticmethod
    def generate_jwt_token(user):
        """
        Generate JWT token for the authenticated user.
        :param user: Authenticated user object
        :return: JWT token
        """
        return create_access_token(identity={'email': user.email, 'username': user.username, 'user_id': user.id, 'role': user.role})