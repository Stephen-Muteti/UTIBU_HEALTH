from models import Payment
from create_app import db


class PaymentService:
    @staticmethod
    def process_payment(order_id, amount):
        """
        Process a new payment.
        :param order_id: ID of the order for which payment is being processed
        :param amount: Amount of the payment
        :return: ID of the newly created payment if successful, None otherwise
        """
        try:
            payment = Payment(order_id=order_id, amount=amount)
            db.session.add(payment)
            db.session.commit()
            return payment.id
        except Exception as e:
            print(f"Error processing payment: {e}")
            db.session.rollback()
            return None

    @staticmethod
    def get_payment_details(payment_id):
        """
        Retrieve payment details.
        :param payment_id: ID of the payment
        :return: Payment details if found, None otherwise
        """
        payment = Payment.query.get(payment_id)
        return payment.serialize() if payment else None


    @staticmethod
    def get_filtered_payments(search_string, page, limit):
        """
        Retrieve filtered payments with pagination.
        :param search_string: String to search for in payment IDs
        :param page: Page number for pagination
        :param limit: Limit of payments per page
        :return: List of dictionaries representing payment details
        """
        try:
            """
            Query payments and apply filtering based on search string
            """
            payments_query = Payment.query
            if search_string:
                payments_query = payments_query.filter(Payment.order_id == int(search_string))

            """
            Apply pagination
            """
            paginated_payments = payments_query.paginate(page=page, per_page=limit)
            serialized_payments = [payment.serialize() for payment in paginated_payments.items]

            return serialized_payments
        except Exception as e:
            print(f"Error fetching filtered payments: {e}")
            return []