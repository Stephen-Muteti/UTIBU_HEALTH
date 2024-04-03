from flask import Blueprint, request, jsonify
from models import Order
from orderservice import OrderService
from medicationservice import MedicationService
from ApiResponse import ApiResponse
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity

"""A Blueprint for order-related endpoints"""
order_bp = Blueprint('order', __name__)


"""
Lets get the currently authenticated user and 
Check whether their role is that of an admin
before proceeding
"""
def check_admin():
    current_user = get_jwt_identity()
    user_role = current_user.get('role')
    return user_role == 'Admin'

"""
Cancelling an order
"""
@order_bp.route('/orders/<int:order_id>/cancel', methods=['PUT'])
def cancel_order(order_id):
    try:
        """
        Call the OrderService method to update the order status
        """
        if OrderService.update_order_status(order_id, 'cancelled'):
            return ApiResponse("Order cancelled successfully", 200).to_response()
        else:
            return ApiResponse("Failed to cancel order", 400).to_response()
    except Exception as e:
        return ApiResponse(str(e), 500).to_response()


"""
Endpoint for placing a new order
This endpoint requires that the user be 
authenticated
"""
@order_bp.route('/orders', methods=['POST'])
@jwt_required()
def place_order():
    data = request.json

    current_user = get_jwt_identity()

    user_id = current_user['user_id']
    medication_id = data.get('medication_id')
    combined_quantity = data.get('quantity')

    """Parse combined quantity input"""
    quantity_value, quantity_unit = MedicationService.parse_combined_quantity_input(combined_quantity)
    if quantity_value is None or quantity_unit is None:
        return ApiResponse("Invalid quantity input format. Please enter quantity in the format 'value unit', e.g., '100 g'.", 400).to_response()

    order_id, error_message = OrderService.place_order(user_id, medication_id, quantity_value, quantity_unit)
    
    if order_id:
        order_details = OrderService.get_order_details(order_id)
        return jsonify({"message": f"Order placed successfully. Your order ID is {order_id}", "orderDetails": order_details}), 200

    elif error_message and error_message == "Unsupported unit conversion":
        return ApiResponse("Unsupported unit conversion. Please check the quantity unit.", 400).to_response()
    
    else:
        return ApiResponse("Failed to place order. Medication not found.", 404).to_response()




"""
Endpoint for fetching all orders. Used by the Admin(pharmacist)
to view all the placed orders
"""
@order_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    
    """Admin role required"""
    if not check_admin():
        return ApiResponse("You cannot perform this action", 403).to_response()

    """
    Get URL parameters
    """
    page = request.args.get('page', default=1, type=int)
    limit = request.args.get('limit', default=10, type=int)
    category = request.args.get('category', default='all', type=str)
    searchstring = request.args.get('searchstring', default='', type=str)
    status = request.args.get('status', default='all', type=str)

    """
    Get user orders using OrderService
    """
    orders = OrderService.get_orders(page, limit, category, searchstring, status)

    if orders is not None:
        """
        Serialize the orders into JSON format
        """
        serialized_orders = [order.serialize() for order in orders.items]

        """
        Return the JSON response
        """
        return jsonify(serialized_orders), 200
    else:
        return ApiResponse("No more orders",500).to_response()




"""
Endpoint for fetching all orders for the currently authenticated user
We require the user's details and hence the jwt_required decorator
"""
@order_bp.route('/orders/user', methods=['GET'])
@jwt_required()
def get_user_orders():
    """
    Get the currently authenticated user ID
    """
    current_user = get_jwt_identity()
    current_user_id = current_user['user_id']

    """
    Get URL parameters
    """
    page = request.args.get('page', default=1, type=int)
    limit = request.args.get('limit', default=10, type=int)
    category = request.args.get('category', default='all', type=str)
    searchstring = request.args.get('searchstring', default='', type=str)
    status = request.args.get('status', default='all', type=str)

    """
    Get user orders using OrderService
    """
    user_orders = OrderService.get_user_orders(current_user_id, page, limit, category, searchstring, status)

    if user_orders is not None:
        """
        Serialize the orders into JSON format
        """
        serialized_orders = [order.serialize() for order in user_orders.items]

        """
        Return the JSON response
        """
        return jsonify(serialized_orders), 200
    else:
        return ApiResponse("No more orders",500).to_response()


"""
Endpoint for fetching order details
This endpoint requires that the user/Admin(pharmacist) be 
authenticated. The Admin can also view the order details 
for a particular order just before updating the status
"""
@order_bp.route('/orders/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return ApiResponse("Order not found",404).to_response()

    order_details = order.serialize()
    return jsonify(order_details), 200



@order_bp.route('/orders/<int:order_id>/edit', methods=['PUT'])
@jwt_required()
def edit_order(order_id):
    data = request.json
    new_medication_id = data.get('medication_id')
    new_quantity = data.get('quantity')

    try:
        """Retrieve the order from the database"""
        order = Order.query.get(order_id)
        if not order:
            return ApiResponse("Order not found", 404).to_response()

        """Check if the order status is pending"""
        if order.status != 'pending':
            return ApiResponse("Order cannot be edited. Status is not pending", 400).to_response()

        """Update the order details"""
        order.medication_id = new_medication_id
        order.quantity = new_quantity

        """Commit the changes to the database"""
        db.session.commit()

        return ApiResponse("Order updated successfully", 200).to_response()
    except Exception as e:
        return ApiResponse(str(e), 500).to_response()



"""
Endpoint for updating order status
This befits the Admin(pharmacist) for updating
the status of a particular order. The status can be 
'pending', 'rejected', 'confirmed', 'shipped', 'delivered'
An order can be rejected if the medication inventory does not
meet what the clients wants
"""
@order_bp.route('/orders/<int:order_id>', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):

    try:
        if not check_admin():
            return ApiResponse("You cannot perform this action", 403).to_response()


        """
        At this point it's really the Admin(pharmacist) trying to
        perform the order update. Check whether the order being updated still
        exists(It could have been deleted before this step). This step ensures that our
        cloud database is Thread Safe
        """
        data = request.json
        new_status = data.get('status')

        if not new_status:
            return ApiResponse("Status field is required", 400).to_response()

        if new_status.lower() not in ['pending', 'rejected', 'confirmed', 'shipped', 'delivered']:
            return ApiResponse("Invalid status value", 400).to_response()
        
        order = Order.query.filter_by(id=order_id).first()
        if not order:
            return ApiResponse("Order could have been deleted or moved", 404).to_response()

        if OrderService.update_order_status(order_id, new_status):
            return ApiResponse("Order status updated successfully", 200).to_response()
        else:
            return ApiResponse("Failed to update order status", 400).to_response()

    except Exception as e:
        print(str(e))
        return ApiResponse(str(e), 500).to_response()        