import os
from flask import Flask, jsonify, request # type: ignore
from flask_sqlalchemy import SQLAlchemy #type: ignore
from flask_bcrypt import Bcrypt #type: ignore
from datetime import datetime, time
from werkzeug.utils import secure_filename #type: ignore

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'} # allowed file extensions?

db = SQLAlchemy()
db.init_app(app)

# hash pwd to put in db
bcrypt = Bcrypt(app)

# ensure file opload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# ------- Database Models ------- #
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    notif_start = db.Column(db.Time, default=time(8, 0))
    notif_end = db.Column(db.Time, default=time(22, 0))

class Image(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    filename = db.Column(db.String(100), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    # foreignKey makes it so that the id in User is also part of Image
    uploaded_at = db.Column(db.DateTime, default=datetime.now())

    user = db.relationship('User', backref='images') # links together both db, backref allows user.images access all images

with app.app_context():
    # db.drop_all()
    db.create_all()

# ------- Helper Functions ------- #
def allowed_files(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# testing
@app.route('/')
def index():
    return "Hello World"

# ---------------------------------------- #
# ------- Authentication Endpoints ------- #
# ---------------------------------------- #
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Successful Login'}), 200
    return jsonify({'message': 'Invalid Credentials'}), 401

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email, password = data.get('email'), data.get('password')
    notif_start = datetime.strptime(data.get('notif_start'), "%H:%M").time()
    notif_end = datetime.strptime(data.get('notif_end'), "%H:%M").time()

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 401

    user = User.query.filter_by(email=email).first()

    if not user:
        user = User(
            email = email,
            password = bcrypt.generate_password_hash(password).decode('utf-8'),
            notif_start = notif_start,
            notif_end = notif_end 
        )

        db.session.add(user)
        db.session.commit()
# ---------------------------------------- #
# ----------- Image Endpoints ------------ #
# ---------------------------------------- #
@app.route('/upload_image', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part in the request'}), 400
    
    file = request.files['file']
    user_id = request.form.get('user_id')

    if not user_id:
        return jsonify({'message': 'User ID is required'}), 400

    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    if file and allowed_files(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        new_image = Image(filename=filename, user_id=user_id)
        db.session.add(new_image)
        db.session.commit()

        return jsonify({'message': 'File uploaded successfully', 'filename': filename}), 201

    return jsonify({'message': 'File type not allowed'}), 400

@app.route('/get_all_images/<int:user_id>', methods=['GET'])
def get_images(user_id):
    images = Image.query.filter_by(user_id=user_id).all()

    if not images:
        return jsonify({'message': 'No images found for this user'}), 404
    
    #prep response
    image_list = [{'id': img.id, 'filename': img.filename, 'uploaded_at': img.uploaded_at} for img in images]
    return jsonify({'images': image_list}), 200

@app.route('/image/<int:image_id>', methods=['GET'])
def get_image(image_id):
    # fetch image by id from db
    image = Image.query.get(image_id)

    if not image:
        return jsonify({'message': 'Image not found'}), 404

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
    if not os.path.exists(filepath):
        return jsonify({'message': 'Image file not found'}), 404

    return jsonify({'id': image.id, 'filename': image.filename, 'uploaded_at': image.uploaded_at}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)