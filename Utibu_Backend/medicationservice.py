from models import Medication
from create_app import db
import re

class MedicationService:
    @staticmethod
    def get_filtered_medications(search_string, page, limit):
        """
        Retrieve filtered medications with pagination.
        :param search_string: String to search for in medication names
        :param page: Page number for pagination
        :param limit: Limit of medications per page
        :return: List of dictionaries representing medication details
        """
        try:
            """
            Query medications and apply filtering based on search string
            """
            medications_query = Medication.query
            if search_string:
                medications_query = medications_query.filter(Medication.name.ilike(f'%{search_string}%'))

            """
            Apply pagination
            """
            paginated_medications = medications_query.paginate(page=page, per_page=limit)
            serialized_medications = [medication.serialize() for medication in paginated_medications.items]

            return serialized_medications
        except Exception as e:
            print(f"Error fetching filtered medications: {e}")
            return []




    @staticmethod
    def create_medication(name, quantity, price):
        """
        Create a new medication.
        :param name: Name of the medication
        :param quantity: Quantity of the medication
        :param price: Price of the medication
        :return: True if medication created successfully, False otherwise
        """
        try:
            medication = Medication(name=name, quantity=quantity, price=price)
            db.session.add(medication)
            db.session.commit()
            return True
        except Exception as e:
            print(f"Error creating medication: {e}")
            db.session.rollback()
            return False

    @staticmethod
    def update_medication(medication_id, name=None, quantity=None, price=None):
        """
        Update medication details.
        :param medication_id: ID of the medication to update
        :param name: New name of the medication (optional)
        :param quantity: New quantity of the medication (optional)
        :param price: New price of the medication (optional)
        :return: True if medication updated successfully, False otherwise
        """
        try:
            medication = Medication.query.get(medication_id)
            if not medication:
                return False

            if name is not None:
                medication.name = name
            if quantity is not None:
                medication.quantity = quantity
            if price is not None:
                medication.price = price

            db.session.commit()
            return True
        except Exception as e:
            print(f"Error updating medication: {e}")
            db.session.rollback()
            return False

    @staticmethod
    def delete_medication(medication_id):
        """
        Delete a medication.
        :param medication_id: ID of the medication to delete
        :return: True if medication deleted successfully, False otherwise
        """
        try:
            medication = Medication.query.get(medication_id)
            if not medication:
                return False

            db.session.delete(medication)
            db.session.commit()
            return True
        except Exception as e:
            print(f"Error deleting medication: {e}")
            db.session.rollback()
            return False


    @staticmethod
    def get_medication(medication_id):
        """
        Get a medication.
        :param medication_id: ID of the medication to retrieve
        :return: The medication details if medication exists, None otherwise
        """
        try:
            medication = Medication.query.get(medication_id)
            if not medication:
                return None
            return medication.serialize()
        except Exception as e:
            print(f"Error getting medication: {e}")
            db.session.rollback()
            return None



    @staticmethod
    def parse_combined_quantity_input(combined_input):
        """
        Parse combined input into numerical value and unit.
        """
        COMBINED_INPUT_PATTERN = r'^(\d+(\.\d+)?)\s*(\w+)$'

        if not combined_input:
            return None, None

        match = re.match(COMBINED_INPUT_PATTERN, combined_input.strip())
        if match:
            value = float(match.group(1))
            unit = match.group(3)
            return value, unit
        else:
            return None, None

    @staticmethod
    def parse_combined_price_input(combined_input):
        """
        Parse combined input for price into numerical value and unit.
        """
        COMBINED_PRICE_INPUT_PATTERN = r'^(\d+(\.\d+)?)\s*\/\s*(\w+)$'

        if not combined_input:
            return None, None

        match = re.match(COMBINED_PRICE_INPUT_PATTERN, combined_input.strip())
        if match:
            value = float(match.group(1))
            unit = match.group(3)
            return value, unit
        else:
            return None, None