from flask import Blueprint, request, jsonify
from models import Payment
from paymentservice import PaymentService
from ApiResponse import ApiResponse
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity

"""
Create a Blueprint for payment-related endpoints
"""
payment_bp = Blueprint('payment', __name__)


"""
Saw it wise to place this logic in a different
method/function since it's used accross multiple
sections
Lets get the currently authenticated user and 
Check whether their role is that of an admin
before proceeding with the other endpoint's logic
"""
def check_admin():
    current_user = get_jwt_identity()
    user_role = current_user.get('role')
    return user_role == 'Admin'


"""
Endpoint for processing a new payment
"""
@payment_bp.route('/payments', methods=['POST'])
@jwt_required()
def process_payment():
    data = request.json
    order_id = data.get('order_id')
    amount = data.get('amount')

    payment_id = PaymentService.process_payment(order_id, amount)

    if payment_id:
        return ApiResponse("Payment processed successfully", 200).to_response()
    else:
        return ApiResponse("Failed to process payment", 400).to_response()


"""
Endpoint for getting all payments from the database
Used by the Admin(pharmacist) for future reference
"""
@payment_bp.route('/payments', methods=['GET'])
@jwt_required()
def get_payments():

    if not check_admin():
        return ApiResponse("You cannot perform this action", 403).to_response()

    """
    Get URL parameters
    """
    page = request.args.get('page', default=1, type=int)
    limit = request.args.get('limit', default=10, type=int)
    searchstring = request.args.get('searchstring', default='', type=str)
    payments = PaymentService.get_filtered_payments(searchstring, page, limit)
    return jsonify(payments), 200




"""
Endpoint for fetching payment details
"""
@payment_bp.route('/payments/<int:payment_id>', methods=['GET'])
def get_payment(payment_id):
    payment = Payment.query.get(payment_id)
    if not payment:
        return ApiResponse("Payment not found", 404).to_response()

    payment_details = payment.serialize()
    return jsonify(payment_details), 200