from flask import Flask, jsonify, request # type: ignore
from flask_sqlalchemy import SQLAlchemy #type: ignore
from flask_bcrypt import Bcrypt #type: ignore
from flask_cors import CORS #type: ignore
from werkzeug.utils import secure_filename #type: ignore
from flask_socketio import SocketIO #type: ignore
import uuid

import os
from datetime import datetime, time, timedelta
from apscheduler.schedulers.background import BackgroundScheduler #type: ignore

from clip_api import get_closest_theme, PREDEFINED_THEMES

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')
CORS(app)

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

scheduler = BackgroundScheduler()
scheduler.start()

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
    theme = db.Column(db.String(100), nullable=True)
    # foreignKey makes it so that the id in User is also part of Image
    uploaded_at = db.Column(db.DateTime, default=datetime.now())

    user = db.relationship('User', backref='images') # links together both db, backref allows user.images access all images

with app.app_context():
    db.drop_all()
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
        return jsonify({'message': 'Successful Login', 'user_id': user.id}), 200
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
    
        return jsonify({'message': 'User created successfully'}), 201
    else:
        return jsonify({'message': 'User already exists. Please Login'}), 202

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

        theme = get_closest_theme(filename)

        new_image = Image(filename=filename + uuid.uuid4(), user_id=user_id, theme=theme)

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
    image_list = [{'id': img.id, 'filename': img.filename, 'theme': img.theme, 'uploaded_at': img.uploaded_at} for img in images]
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

    return jsonify({'id': image.id, 'filename': image.filename, 'theme': image.theme, 'uploaded_at': image.uploaded_at}), 200

# ---------------------------------------- #
# ------- ALBUM & STORIES ENDPOINT ------- #
# ---------------------------------------- #
@app.route('/albums/<int:user_id>', methods=['GET'])
def get_albums(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    images = Image.query.filter_by(user_id=user_id).all()
    if not images:
        return jsonify({'message': 'No images found for this user'}), 404

    # Organize images by theme
    album_dict = {theme: [] for theme in PREDEFINED_THEMES}
    for img in images:
        if img.theme in album_dict:
            album_dict[img.theme].append({
                'id': img.id,
                'filename': img.filename,
                'uploaded_at': img.uploaded_at.isoformat() if img.uploaded_at else None
            })
    return jsonify({'albums': album_dict}), 200

@app.route('/stories/<int:user_id>', methods=['GET'])
def get_stories(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    one_week_ago = datetime.now() - timedelta(days=7)

    images = Image.query.filter(Image.user_id == user_id, Image.uploaded_at >= one_week_ago).order_by(Image.uploaded_at).all()

    if not images:
        return jsonify({'message': 'No recent images found for this user'}), 404

    story_list = [{
        'id': img.id,
        'filename': img.filename,
        'uploaded_at': img.uploaded_at.isoformat() if img.uploaded_at else None
    } for img in images]

    return jsonify({'stories': story_list}), 200

@app.route('/random_stories/<int:user_id>', methods=['GET']) # NOT currently logged in user
def get_stories(user_id):
    current_user = User.query.get(user_id)
    if not current_user:
        return jsonify({'message': 'User not found'}), 404

    other_user = User.query.filter(User.id != user_id).order_by(db.func.random()).first()
    if not other_user:
        return jsonify({'message': 'No other users found'}), 404

    return get_stories(other_user.id)

# ---------------------------------------- #
# -------- Notification Function --------- #
# ---------------------------------------- #
def send_notification():
    notification_message = f"Notification sent at {datetime.now()}"
    print(notification_message)
    socketio.emit('notification', {'message': notification_message})

def schedule_notification(delay):
    run_time = datetime.now() + timedelta(seconds=delay)

    scheduler.add_job(
        send_notification,
        'date',
        run_date=run_time
    )
    print(f"Scheduled notification to be sent in {delay} seconds at {run_time}")

if __name__ == '__main__':
    # !-------CONTROL FOR DEMOING PURPOSES-------!
    delay = 5 # testing pursposes
    # delay = 30 # demoing purposes
    schedule_notification(delay)

    socketio.run(app, host='0.0.0.0', port=5001, debug=True)