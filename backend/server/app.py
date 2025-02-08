from flask import Flask, jsonify, request # type: ignore
from flask_sqlalchemy import SQLAlchemy #type: ignore
from flask_bcrypt import Bcrypt #type: ignore
from datetime import datetime

app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI']

db = SQLAlchemy()
db.init_app(app)

bcrypt = Bcrypt(app)

@app.route('/')
def index():
    return "Hello World"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)