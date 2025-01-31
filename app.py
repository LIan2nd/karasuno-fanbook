# Import Package
import os
from os.path import join, dirname
from dotenv import load_dotenv

from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient

# Setup
dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

MONGODB_URI = os.environ.get("MONGODB_URI")
DB_NAME =  os.environ.get("DB_NAME")

client = MongoClient(MONGODB_URI)

db = client[DB_NAME]
app = Flask(__name__)

@app.route('/')
def home() :
  return render_template('index.html')

@app.route('/message', methods=["GET"])
def message_get() :
  messages = list(db.fanmessage.find({}, {"_id" : False}))
  return jsonify({"messages" : messages})

@app.route('/message', methods=["POST"])
def message_post() :
  nickname = request.form['nickname']
  message = request.form['message']

  doc = {
    "nickname" : nickname,
    "message" : message
  }

  db.fanmessage.insert_one(doc)
  return jsonify({'msg' : "Fan Message successfully posted"})

port=5000
debug=True
if __name__ == "__main__" :
  app.run('0.0.0.0', port=port, debug=debug)