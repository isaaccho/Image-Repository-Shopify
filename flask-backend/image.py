from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
import sqlite3 as sql
from shoes import shoes
import os

app = Flask(__name__)

APP_ROOT = os.path.dirname(os.path.abspath(__file__))

def get_cursor():
    conn = sql.connect("database.db")
    #conn = sql.connect(':memory:')
    cur = conn.cursor()
    return (cur, conn)

def initialize_db():
    (cur, conn) = get_cursor()
    # cur.execute("""SELECT * from releases""")
    # print(cur.fetchall())
    cur.execute("""SELECT count(*) FROM sqlite_master WHERE name = 'releases'""")
    if cur.fetchone()[0] == 1:
        cur.close()
        return
    print('somethings happening')
    # creating a table to store the shoes
    cur.execute("""CREATE TABLE releases (id INTEGER PRIMARY KEY, name TEXT, imgpath TEXT, marketprice INTEGER)""")
    

    # instanciating shoes class and storing them in the list
    list_shoes = []

    shoe1 = shoes('Mocha Jordan 1', 'images/mocha_jordan_1.jpeg', 550)
    shoe2 = shoes('Chunky Dunky', 'images/chunky_dunky.jpg', 1500)
    shoe3 = shoes('Travis Scott Dunk', 'images/travis_scott_dunk.jpeg', 2400)
    shoe4 = shoes('Off White Jordan 4', 'images/off_white_jordan_4.jpeg', 2000)
    shoe5 = shoes('Union Guava Jordan 4', 'images/union_guava_jordan_4.jpeg', 1200)
    shoe6 = shoes('Stussy Spiridon', 'images/stussy_spiridon.jpeg', 650)
    shoe7 = shoes('Yeezy Quantum', 'images/yeezy_quantum.jpeg', 450)
    shoe8 = shoes('Dior Jordan 1', 'images/dior_jordan_1.jpeg', 10000)
    shoe9 = shoes('Strangelove Dunk', 'images/strangelove_dunk.jpeg', 1300)
    shoe10 = shoes('Off White Jordan 5', 'images/off_white_jordan_5.jpeg', 1250)


    list_shoes.append(shoe1)
    list_shoes.append(shoe2)
    list_shoes.append(shoe3)
    list_shoes.append(shoe4)
    list_shoes.append(shoe5)
    list_shoes.append(shoe6)
    list_shoes.append(shoe7)
    list_shoes.append(shoe8)
    list_shoes.append(shoe9)
    list_shoes.append(shoe10)

    # looping through the list of shoes and inserting them into the table: releases
    for i in list_shoes:
        cur.execute("INSERT INTO releases VALUES (NULL, :name, :imgpath, :marketprice)", {'name': i.name, 'imgpath': i.path, 'marketprice': i.marketprice})

    conn.commit()
    print("Created the database and tables")






@app.route("/")
def home():
    return render_template("index.html")

@app.route("/shoes", methods=['GET'])
def list_shoes():
    (cur, _) = get_cursor()
    cur.execute("SELECT * FROM releases")
    allshoes = cur.fetchall()

    shoeholder = []
    for shoe in allshoes:
        shoeholder.append({
            "name": shoe[1],
            "imgpath": shoe[2],
            "marketprice": shoe[3]
        })

    return jsonify({'shoes': shoeholder})


@app.route('/upload', methods=['POST'])
def upload():
    target = os.path.join(APP_ROOT, 'static/images')

    pic = request.files['file']
    image_name = pic.filename
    shoe_name = request.form['name']
    shoe_price = request.form['price']
    print(shoe_name)
    print(shoe_price)

    if not pic:
        return "no image added", 400

    destination = "/".join([target,image_name])
    pic.save(destination)
    
    (cur, conn) = get_cursor()
    print('before')
    cur.execute(
        "INSERT INTO releases VALUES (NULL, :name, :imgpath, :marketprice)",
        {'name': shoe_name, 'imgpath': 'images/' + image_name, 'marketprice': shoe_price}
    )
    print('yayya')
    print(cur.fetchall())
    conn.commit()
    return pic.filename


if __name__ == "__main__":
    initialize_db()
    app.run(debug = True)