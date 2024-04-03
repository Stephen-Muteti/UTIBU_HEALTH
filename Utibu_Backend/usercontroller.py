from flask import Blueprint, request, jsonify
from models import User
from userservice import UserService
from ApiResponse import ApiResponse
from create_app import db
from flask_jwt_extended import jwt_required, get_jwt_identity

"""A Blueprint for user-related endpoints"""
user_bp = Blueprint('user', __name__)

"""Endpoint for user registration"""
@user_bp.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'user')
    phone = data.get('phone')

    try:
        """Check if email already exists"""
        if UserService.check_existing_user(email):
            return ApiResponse("Email already exists", 400).to_response()

        """Create a new user"""
        user = User(username=username, email=email, password=password, role=role, phone=phone)  # Include phone
        db.session.add(user)
        db.session.commit()

        return ApiResponse("User registered successfully", 200).to_response()
    except Exception as e:
        print(f"An error occurred during user registration: {str(e)}")
        return ApiResponse("An error occurred during user registration", 500).to_response()


@user_bp.route('/login', methods=['POST'])
def login_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    """Authenticate user"""
    user = UserService.authenticate_user(email, password)
    if not user:
        return ApiResponse("Invalid email or password", 401).to_response()

    """Generate JWT token"""
    token = UserService.generate_jwt_token(user)

    """Serialize user object"""
    user_data = user.serialize()

    """Return token and user data"""
    response_data = {
        'token': token,
        'user': user_data
    }

    return jsonify(response_data), 200

"""Endpoint for fetching user details"""
@user_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return ApiResponse("User not found", 404).to_response()

    """Return user details"""
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email
    }), 200


@user_bp.route('/validate_token', methods=['GET'])
@jwt_required()
def  validate_token():
    try:
        current_user = get_jwt_identity()
        return jsonify({'user': current_user}), 200
    except Exception as e:
        print(e)
        return ApiResponse(f"User not found: {e}", 401).to_response()
