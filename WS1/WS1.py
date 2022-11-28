from flask import Flask, render_template, request
from flask_restful import reqparse, abort, Api, Resource
import json
import sqlite3 as sl
from random import randint
import base64
import sqlite3 as sl
from flask_cors import CORS
import pyperclip

con = sl.connect('MARSIMAGES.db', check_same_thread=False)
currentcursor = con.cursor()

with con:
    con.execute("""
      CREATE TABLE IF NOT EXISTS marsimages (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        filename TEXT
      );
    """)

# Populate table with references
def populateDB():
    # populate db if empty
    print(currentcursor.rowcount)
    if (currentcursor.execute("SELECT COUNT(*) FROM marsimages").fetchone()[0] == 0): 
        # range non-inclusive
        for i in range(40, 65, 1):
            putImageIntoDB('FLF_0' + str(i) + '.png')
        print (currentcursor.execute("SELECT COUNT(*) FROM marsimages").fetchone()[0])

def putImageIntoDB(filename):
    currentcursor.execute('INSERT INTO marsimages (filename) VALUES(?)', (filename,))
    con.commit()

# Encode image to send back
def encode(photo):
    path = 'images/' + photo
    with open(path, "rb") as file:
        encoded = base64.b64encode(file.read())
    return encoded
    # with open("imageToSave.png", "wb") as fh:
    #     fh.write(base64.decodebytes(encoded_string))


app = Flask(__name__, template_folder='templates')
api = Api(app)
CORS(app)

@app.before_first_request
def before_first_request():
    populateDB()

@app.route('/random')
def random():
    number_of_rows = currentcursor.execute("SELECT COUNT(*) FROM marsimages").fetchone()[0]
    id = randint(1, number_of_rows)
    print (currentcursor.execute("SELECT COUNT(*) FROM marsimages").fetchone()[0])
    currentcursor.execute('SELECT filename FROM marsimages WHERE id = (?);', (id, ))
    file_name = currentcursor.fetchone()[0]
    json_list = json.dumps({'encoded_picture' : str(encode(file_name))[2:-1]})
    return(json_list)



if __name__ == '__main__':
    app.run(debug = True, port = 5004)
