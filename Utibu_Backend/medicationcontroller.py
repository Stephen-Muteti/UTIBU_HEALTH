from flask import Blueprint, request, jsonify
from models import Medication
from medicationservice import MedicationService
from ApiResponse import ApiResponse
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from create_app import db

"""
A Blueprint for medication-related endpoints
"""
medication_bp = Blueprint('medication', __name__)

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
Endpoint for listing all medications
This can be accessed by any user of the 
system. Even normal users(clients) need 
to know what kind of medications are available
so they can make informed decisions on what to order
We don't need authentication for this endpoint
For the normal user however we don't display the quantity
in store
"""
@medication_bp.route('/medications', methods=['GET'])
def get_medications():
    search_string = request.args.get('searchstring', default='', type=str)
    page = request.args.get('page', default=1, type=int)
    limit = request.args.get('limit', default=10, type=int)

    medications = MedicationService.get_filtered_medications(search_string, page, limit)
    return jsonify(medications), 200


"""
Endpoint to get the details for a single medication record
This is what the Admin(pharmacist) uses to update a medication's
details such as the Quantity or the price
"""
@medication_bp.route('/medications/<int:medication_id>', methods=['GET'])
@jwt_required()
def get_medication(medication_id):

    if not check_admin():
        return ApiResponse("You cannot perform this action", 403).to_response()

    medication = MedicationService.get_medication(medication_id)
    
    if not medication:
        return ApiResponse("The medication might have been deleted or moved", 404)
    return jsonify(medication), 200


"""
Endpoint for creating a new medication
This can be used by the Admin(pharmacist)
for adding new medications to the database
so that they are available to the users
"""
@medication_bp.route('/medications', methods=['POST'])
@jwt_required()
def create_medication():

    if not check_admin():
        return ApiResponse("You cannot perform this action", 403).to_response()

    data = request.json    
    
    name = data.get('name')
    quantity = data.get('quantity', '0 g')
    price = data.get('price', '0/g')

    """Parse quantity input"""
    quantity_value, quantity_unit = MedicationService.parse_combined_quantity_input(quantity)
    if quantity_value is None or quantity_unit is None:
        return ApiResponse("Invalid quantity input format. Please enter quantity in the format 'value unit', e.g., '100 g'.", 400).to_response()

    """Parse price input"""
    price_value, price_unit = MedicationService.parse_combined_price_input(price)
    if price_value is None or price_unit is None:
        return ApiResponse("Invalid price input format. Please enter price in the format 'value/unit', e.g., '5/g'.", 400).to_response()

    medication = Medication(name=name, quantity_value=quantity_value, quantity_unit=quantity_unit,
                            price_value=price_value, price_unit=price_unit)
    db.session.add(medication)
    db.session.commit()

    return ApiResponse("Medication created successfully",200).to_response()



"""
Endpoint for updating medication details
This enables the Admin(pharmacist) to update the inventory
for the entire application
The person accessing this endpoint needs to be authenticated
"""
@medication_bp.route('/medications/<int:medication_id>', methods=['PUT'])
@jwt_required()
def update_medication(medication_id):

    if not check_admin():
        return ApiResponse("You cannot perform this action", 403).to_response()

    """
    At this point, it's really the Admin(pharmacist) trying to
    perform the update. Check whether the medication being updated still
    exists (It could have been deleted before this step). This step ensures that our
    cloud database is Thread Safe
    """
    medication = Medication.query.get(medication_id)
    if not medication:
        return ApiResponse("Medication not found", 404).to_response()

    """
    Update the attributes and commit the changes to the database
    If no values were provided then keep the existing values
    """
    data = request.json
    
    """Parse quantity input"""
    quantity = data.get('quantity', f"{medication.quantity_value} {medication.quantity_unit}")
    quantity_value, quantity_unit = MedicationService.parse_combined_quantity_input(quantity)
    if quantity_value is None or quantity_unit is None:
        return ApiResponse("Invalid quantity input format. Please enter quantity in the format 'value unit', e.g., '100 g'.", 400).to_response()

    """Parse price input"""
    price = data.get('price', f"{medication.price_value} / {medication.price_unit}")
    price_value, price_unit = MedicationService.parse_combined_price_input(price)
    if price_value is None or price_unit is None:
        return ApiResponse("Invalid price input format. Please enter price in the format 'value/unit', e.g., '5/g'.", 400).to_response()

    medication.name = data.get('name', medication.name)
    medication.quantity_value = quantity_value
    medication.quantity_unit = quantity_unit
    medication.price_value = price_value
    medication.price_unit = price_unit

    db.session.commit()

    return ApiResponse("Medication updated successfully", 200).to_response()


"""
Endpoint for deleting a medication
This is only accessible to the Admin(pharmacist)
"""
@medication_bp.route('/medications/<int:medication_id>', methods=['DELETE'])
@jwt_required()
def delete_medication(medication_id):

    if not check_admin():
        return ApiResponse("You cannot perform this action", 403).to_response()

    """
    At this point it's really the Admin(pharmacist) trying to
    perform the deletion. Check whether the medication being deleted still
    exists(It could have been deleted before this step). This step ensures that our
    cloud database is Thread Safe
    """
    medication = Medication.query.get(medication_id)
    if not medication:
        return ApiResponse("Medication not found", 404).to_response()

    """
    Perform the deletion and commit the changes
    """
    db.session.delete(medication)
    db.session.commit()

    return ApiResponse("Medication deleted successfully", 200).to_response()