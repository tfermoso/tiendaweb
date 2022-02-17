# serve.py

from flask import Flask,redirect,url_for,make_response
from flask import render_template
from flask import request,session,jsonify
import os
import pathlib


import json
import hashlib

from jinja2 import Undefined


def removeProduct(id):
    tienda={}
    with open("dato_tienda.json",'r') as file:
        tienda=json.load(file);
        file.close()
    productos=tienda["productos"];
    pEliminar=None;
    for item in productos:
        if(item["id"]==id):
            pEliminar=item;
            break;
    productos.remove(pEliminar);
    with open("dato_tienda.json",'w') as file:
        json.dump(tienda,file,indent=2);
        file.close()
    return productos;

def guardarProducto(nombreProducto,descripcion,filename,precio,cantidad):
    tienda={}
    with open("dato_tienda.json",'r') as file:
        tienda=json.load(file);
        file.close()

    if("contador" in tienda.keys()):
        tienda["contador"]+=1;
    else:
        tienda["contador"]=0;
        
    contador=tienda["contador"];

    tienda["productos"].append(
        {"nombre":nombreProducto,
        "descripcion":descripcion,
        "img":filename,
        "precio":precio,
        "cantidad":cantidad,
        "id":contador
        })

    with open("dato_tienda.json",'w') as file:
        json.dump(tienda,file,indent=2);
        file.close()
    return tienda["productos"];

def editProducto(idProducto,nombreProducto,descripcion,filename,precio,cantidad):
    tienda={}
    with open("dato_tienda.json",'r') as file:
        tienda=json.load(file);
        file.close()
    for p in tienda["productos"]:
        if(p["id"]==idProducto):
            p["nombre"]=nombreProducto;
            p["descripcion"]=descripcion 
            if(filename!=""):
                p["img"]=filename
            p["precio"]=precio;
            p["cantidad"]=cantidad;
            break;
    with open("dato_tienda.json",'w') as file:
        json.dump(tienda,file,indent=2);
        file.close()
    
def nombreUnico(fichero,directorio):
    dir=pathlib.Path(directorio)
    encontrado=False;
    for file in dir.iterdir():
        if(file.name==fichero):
            encontrado=True
            break;
    if(not encontrado):
        return fichero
    contador=fichero.split(".")[0][len(fichero.split(".")[0])-1]
    cont=0
    if(contador.isnumeric()):
        cont=int(contador)+1;
    fichero=fichero.split(".")[0]+str(cont)+"."+fichero.split(".")[1]
    return nombreUnico(fichero,directorio)

def validar(usr,password):
    tienda={};
    with open("dato_tienda.json",'r') as file:
        tienda=json.load(file);
        file.close();
    for u in tienda["usuarios"]:
        if(u["usuario"]==usr) and (u["password"]==hashlib.sha224(bytes(password,encoding="utf-8")).hexdigest()):
            return True
    return False
    
def comprobarUsuario(usr):
    tienda={}
    with open("dato_tienda.json",'r') as file:
        tienda=json.load(file);
        file.close();
    for u in tienda["usuarios"]:
        if(u["usuario"]==usr):
            return True
    return False

def registrarUsuario(usr,passw):
    tienda={}
    with open("dato_tienda.json",'r') as file:
        tienda=json.load(file);
        file.close()

    tienda["usuarios"].append({"usuario":usr,"password":hashlib.sha224(bytes(passw,encoding="utf-8")).hexdigest()})

    with open("dato_tienda.json",'w') as file:
        json.dump(tienda,file,indent=2);
        file.close()

def leerProductosFichero():
    tienda={}
    with open("dato_tienda.json",'r') as file:
        tienda=json.load(file);
        file.close()
    return tienda["productos"];

# creates a Flask application, named app
app = Flask(__name__,static_folder='templates/static')

# a route where we will display a welcome message via an HTML template
@app.route("/")
def hello():
    return redirect(url_for('login'))
    #return render_template('index.html',dato="hola")

@app.route('/producto')
def paginaProducto():
    #name = request.cookies.get('userId')
    nombreUsuario=session.get("nombreUsuario");
    print(nombreUsuario)
    if nombreUsuario==None:
        return redirect(url_for('login'));
    else:
     return render_template('index.html',nombre=nombreUsuario)

@app.route('/crearproducto',methods=['GET','POST'])
def crearProducto():
    if(request.method=='GET'):
        return render_template("formularioproducto.html")
    else:
        nombreProducto=request.form["nombre"];
        descripcion=request.form["descripcion"]
        f = request.files['archivo']    
        filename = f.filename;
        filename=nombreUnico(filename,"./templates/static/img")
        precio=request.form["precio"];
        cantidad=request.form["cantidad"];
        f.save(os.path.join('./templates/static/img', filename))
        productos=guardarProducto(nombreProducto,descripcion,filename,precio,cantidad) 
        print(productos);
        return redirect(url_for("crearProducto"));

@app.route('/cerrarSesion')
def cerrarSesion():
    response=make_response(redirect(url_for("login")))
    response.delete_cookie("userId");
    return response

@app.route('/prueba')
def prueba():
    return "hola mundo";

@app.route('/login',methods = ['POST', 'GET'])
def login():
    if(request.method=="GET"):
        return render_template('login.html')
    elif  (request.method=="POST"):
        usuario=request.form["usr"];
        password=request.form["password"];
        if(validar(usuario,password)):
            response = make_response(redirect(url_for('paginaProducto')))
            #response.set_cookie("userId",hashlib.sha224(bytes(usuario,encoding="utf-8")).hexdigest());
            session["nombreUsuario"]=usuario;
            return response
        else:
            msg="Usuario o contraseña incorrecto";
            return render_template('login.html',mensaje=msg)  

@app.route('/registro',methods=['GET'])
def registro():
    return render_template("registro.html");

@app.route('/getproducts',methods=["GET"])
def getProducts():
    productos=leerProductosFichero();
    return jsonify(productos);


@app.route('/crearUsuario',methods=['POST'])
def crearUsuario():
    usuario=request.form["nombre"];
    password=request.form.get("password");
    if(comprobarUsuario(usuario)):
        msg="Usuario ya existe";
        return redirect(url_for("registro",mensaje=msg))
    else: 
        #Crear usuario
        registrarUsuario(usuario,password)
        return redirect(url_for("login",usr=usuario))

@app.route('/procesarLogin',methods=['POST'])
def procesar():
    return "hola mundo"; 


@app.route("/eliminarproducto",methods=["GET","POST"])
def eliminarProducto():
    idproducto=int(request.args["id"])
    result=removeProduct(idproducto)
    return jsonify(result);

@app.route("/editarproducto",methods=["POST"])
def editarProducto():
    idProducto=int(request.form["idProducto"]);
    nombreProducto=request.form["nombre"];
    descripcion=request.form["descripcion"];
    precio=request.form["precio"];
    cantidad=request.form["cantidad"];
    f = request.files['archivo']    
    filename = f.filename;
    if(filename!=""):
        filename=nombreUnico(filename,"./templates/static/img")
        f.save(os.path.join('./templates/static/img', filename))  
    productos=editProducto(idProducto,nombreProducto,descripcion,filename,precio,cantidad) 
    return redirect(url_for("crearProducto"));


# run the application
if __name__ == "__main__":

    app.secret_key = "generador de claves de sesión"
    app.run(host="localhost",port=8085,debug=True)
    



