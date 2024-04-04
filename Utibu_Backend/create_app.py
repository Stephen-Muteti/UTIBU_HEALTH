from flask import Flask
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import timedelta

"""Initialize Flask extensions"""
bcrypt = Bcrypt()
jwt = JWTManager()
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    # Create Flask app
    app = Flask(__name__)

    """Initialize Flask extensions with the app"""
    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(app, origins='https://utibu-frontend-56d24be6acf1.herokuapp.com')

    """JWT configurations"""
    app.config['JWT_SECRET_KEY'] = 'Team_leader_254'
    expiration_time = timedelta(days=1)
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = expiration_time
    
    """Configure database URI"""
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://dqvkstfu:pMzWV-EEBesznu8_y7spgAtGV8IstKWq@bubble.db.elephantsql.com/dqvkstfu'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    """Suppress SQLAlchemy deprecation warning"""
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    """Register blueprints (controllers) with the app"""
    from usercontroller import user_bp
    from medicationcontroller import medication_bp
    from ordercontroller import order_bp
    from paymentcontroller import payment_bp
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(medication_bp, url_prefix='/api')
    app.register_blueprint(order_bp, url_prefix='/api')
    app.register_blueprint(payment_bp, url_prefix='/api')

    """Initialize SQLAlchemy with the app"""
    db.init_app(app)
    migrate.init_app(app, db)

    return app