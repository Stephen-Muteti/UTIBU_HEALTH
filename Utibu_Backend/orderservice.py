from models import Order
from sqlalchemy import or_
from datetime import datetime, timedelta
from create_app import db
from models import Medication, User

class OrderService:
    @staticmethod
    def get_orders(page=1, limit=10, category='all', searchstring='', status='all'):
        """
        Get orders based on filters.
        :param page: Page number for pagination
        :param limit: Limit of orders per page
        :param category: Category filter for orders
        :param searchstring: Search string for filtering orders
        :param status: Status filter for orders
        :return: Paginated orders if successful, None otherwise
        """
        try:
            """
            Query orders
            """
            orders_query = Order.query

            """
            Apply category filter
            """
            if category != 'all':
                if category == 'today':
                    start_of_today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
                    orders_query = orders_query.filter(Order.created_at >= start_of_today)
                elif category == 'week':
                    start_of_week = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=datetime.now().weekday())
                    orders_query = orders_query.filter(Order.created_at >= start_of_week)

            if searchstring:
                orders_query = orders_query.join(Order.medication)
                orders_query = orders_query.join(Order.user)
                orders_query = orders_query.filter(or_(
                    Order.status.ilike(f'%{searchstring}%'),
                    Medication.name.ilike(f'%{searchstring}%'),  # Access name attribute through Medication
                    User.username.ilike(f'%{searchstring}%')
                ))


            """
            Apply status filter
            """
            if status != 'all':
                orders_query = orders_query.filter_by(status=status)

            """
            Paginate the results
            """
            user_orders = orders_query.paginate(page=page, per_page=limit)
        
            return user_orders
        except Exception as e:
            print(f"Error fetching orders: {e}")
            return None



    @staticmethod
    def get_user_orders(user_id, page=1, limit=10, category='all', searchstring='', status='all'):
        """
        Get orders for the specified user based on filters.
        :param user_id: ID of the user
        :param page: Page number for pagination
        :param limit: Limit of orders per page
        :param category: Category filter for orders
        :param searchstring: Search string for filtering orders
        :param status: Status filter for orders
        :return: Paginated orders if successful, None otherwise
        """
        try:
            """
            Query orders associated with the user
            """
            user_orders_query = Order.query.filter_by(user_id=user_id)

            """
            Apply category filter
            """
            if category != 'all':
                if category == 'today':
                    start_of_today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
                    user_orders_query = user_orders_query.filter(Order.created_at >= start_of_today)
                elif category == 'week':
                    start_of_week = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=datetime.now().weekday())
                    user_orders_query = user_orders_query.filter(Order.created_at >= start_of_week)


            """
            Apply search string filter
            """
            if searchstring:
                user_orders_query = user_orders_query.join(Order.medication)
                user_orders_query = user_orders_query.join(Order.user)
                user_orders_query = user_orders_query.filter(or_(
                    Order.status.ilike(f'%{searchstring}%'),
                    Medication.name.ilike(f'%{searchstring}%'),
                    User.username.ilike(f'%{searchstring}%')
                ))


            """
            Apply status filter
            """
            if status != 'all':
                user_orders_query = user_orders_query.filter(Order.status == status)

            """
            Paginate the results
            """
            user_orders = user_orders_query.paginate(page=page, per_page=limit)
        
            return user_orders
        except Exception as e:
            print(f"Error fetching user orders: {e}")
            return None

    

    @staticmethod
    def place_order(user_id, medication_id, quantity_value, quantity_unit):
        """
        Place a new order.
        :param user_id: ID of the user placing the order
        :param medication_id: ID of the medication being ordered
        :param quantity_value: Quantity value of the medication being ordered
        :param quantity_unit: Quantity unit of the medication being ordered
        :return: ID of the newly created order if successful, None otherwise
        """
        try:
            """Check if the medication with the provided ID exists"""
            medication = Medication.query.get(medication_id)
            if not medication:
                return None, None



            """Convert the provided quantity to the base unit of the medication"""
            quantity_in_base_unit = medication.convert_quantity_to_base_unit(quantity_value, quantity_unit, medication.quantity_unit)
            print(quantity_in_base_unit)
            if quantity_in_base_unit is None:
                return None, "Unsupported unit conversion"

            """Check if the converted quantity is less than or equal to the available quantity"""
            if medication.quantity_value >= quantity_in_base_unit:
                """Sufficient quantity available, set order status as confirmed"""
                order_status = 'confirmed'

                """
                Reduce the quantity in store by the order quantity
                They are currently in the same units(that of the medication quantity unit)
                So just subtract and store back
                """
                remainder_quantity = medication.quantity_value - quantity_in_base_unit
                """Update the medication quantity in the database with the remainder"""
                medication.quantity_value = remainder_quantity
                db.session.commit()
            
            else:
                """Insufficient quantity available, set order status as pending"""
                order_status = 'pending'


            """Calculate total price based on the provided quantity and medication's price"""
            total_price = medication.calculate_total_price(quantity_value, quantity_unit)
            if total_price is None:
                return None, "Unsupported unit conversion"

            
            """Create the order"""
            order = Order(
                user_id=user_id,
                medication_id=medication_id, 
                quantity_value=quantity_value, 
                quantity_unit=quantity_unit, 
                total_price=total_price, 
                status=order_status
                )
            db.session.add(order)
            db.session.commit()
            return order.id, None
        except Exception as e:
            print(f"Error placing order: {e}")
            db.session.rollback()
            return None



    @staticmethod
    def get_order_details(order_id):
        order = Order.query.get(order_id)
        if order:
            order_details = order.serialize()
            return order_details
        else:
            return None

    @staticmethod
    def update_order_status(order_id, new_status):
        """
        Update the status of an existing order.
        :param order_id: ID of the order to update
        :param new_status: New status value for the order
        :return: True if order status updated successfully, False otherwise
        """
        try:
            """Retrieve the order from the database"""
            order = Order.query.get(order_id)
            if not order:
                return False

            """Update the status of the order"""
            order.status = new_status
            db.session.commit()
            return True
        except Exception as e:
            print(f"Error updating order status: {e}")
            db.session.rollback()
            return False