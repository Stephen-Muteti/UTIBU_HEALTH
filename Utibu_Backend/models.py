from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime
from create_app import db, bcrypt

"""User Model"""
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=True)
    _password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='user')

    orders = relationship('Order', backref='orders_user', lazy=True)

    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def password(self, plaintext_password):
        self._password = bcrypt.generate_password_hash(plaintext_password).decode('utf-8')

    def check_password(self, plaintext_password):
        return bcrypt.check_password_hash(self._password, plaintext_password)

    def serialize(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'phone': self.phone,
            'role': self.role
            }

"""Medication Model"""
class Medication(db.Model):
    __tablename__ = 'medications'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    quantity_value = db.Column(db.Float, nullable=False)
    quantity_unit = db.Column(db.String(20), nullable=False)
    price_value = db.Column(db.Float, nullable=False)
    price_unit = db.Column(db.String(20), nullable=False)

    orders = relationship('Order', backref='ordered_medication', lazy=True)

    def serialize(self):
        """
        Serialize the Medication object into a dictionary.
        :return: Dictionary representing medication details
        """
        return {
            'id': self.id,
            'name': self.name,
            'quantity': f"{self.quantity_value} {self.quantity_unit}",
            'price': f"{self.price_value} / {self.price_unit}"
        }


    def convert_quantity_to_base_unit(self, quantity_value, quantity_unit):
        """
        Convert the provided quantity to the base unit of the medication.
        """
        if quantity_unit == self.quantity_unit:
            return quantity_value
        elif quantity_unit in ["g", "mg", "kg"] and self.quantity_unit in ["g", "mg", "kg"]:
            """Convert between weight units (g, mg, kg)"""
            if quantity_unit == "g" and self.quantity_unit == "mg":
                return quantity_value * 1000
            elif quantity_unit == "mg" and self.quantity_unit == "g":
                return quantity_value / 1000
            elif quantity_unit == "kg" and self.quantity_unit == "g":
                return quantity_value * 1000
            elif quantity_unit == "g" and self.quantity_unit == "kg":
                return quantity_value / 1000
            elif quantity_unit == "mg" and self.quantity_unit == "kg":
                return quantity_value / 1000000
            elif quantity_unit == "kg" and self.quantity_unit == "mg":
                return quantity_value * 1000000
        elif quantity_unit in ["ml", "l"] and self.quantity_unit in ["ml", "l"]:
            """Convert between volume units (ml, l)"""
            if quantity_unit == "ml" and self.quantity_unit == "l":
                return quantity_value / 1000
            elif quantity_unit == "l" and self.quantity_unit == "ml":
                return quantity_value * 1000
        else:
            return None

    def calculate_total_price(self, quantity_value, quantity_unit):
        """
        Calculate the total price based on the provided quantity value and the medication's price.
        """
        """Convert quantity to the base unit of the medication"""
        quantity_in_base_unit = self.convert_quantity_to_base_unit(quantity_value, quantity_unit)
        if quantity_in_base_unit is None:
            return None

        """Calculate total price"""
        total_price = quantity_in_base_unit * self.price_value
        return total_price

"""Order Model"""
class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    medication_id = db.Column(db.Integer, db.ForeignKey('medications.id'), nullable=False)
    quantity_value = db.Column(db.Float, nullable=False)
    quantity_unit = db.Column(db.String(20), nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship('User', backref='user_orders', lazy=True)
    medication = relationship('Medication', backref='medication_orders', lazy='joined', overlaps="ordered_medication")

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'medication_name': self.medication.name,
            'username': self.user.username,
            'quantity': f"{self.quantity_value} {self.quantity_unit}",
            'total_price': self.total_price,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S')
        }


"""Payment Model"""
class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    """Define relationship with the Order model"""
    order = relationship('Order', backref='payments', lazy=True)

    def serialize(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'amount': self.amount,
            'payment_date': self.payment_date.strftime('%Y-%m-%d %H:%M:%S')
        }