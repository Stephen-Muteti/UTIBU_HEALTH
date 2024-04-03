import create_app
from models import User
from create_app import db


app = create_app.create_app()

with app.app_context():
    def register_admin():
        """Check if an Admin user already exists"""
        admin_user = User.query.filter_by(role='Admin').first()
        if admin_user:
            print("Admin user already exists.")
            return
        
        """If Admin user doesn't exist, create one"""
        admin_username = 'Admin'
        admin_email = 'admin@utibu.com'
        admin_password = 'Jocteve1@'
        admin_role = 'Admin'
        admin_phone = '0794500790'
        
        admin = User(username=admin_username, email=admin_email, phone=admin_phone, password=admin_password, role=admin_role)
        db.session.add(admin)
        db.session.commit()
        print("Admin user created successfully.")

    """Register Admin user when the application starts"""
    register_admin()

if __name__ == '__main__':
    app.run(debug=True)