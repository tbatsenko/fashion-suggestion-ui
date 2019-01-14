#!/usr/bin/env python

import os
from flask import Flask, render_template, request, redirect, json, Response
import base64

import pandas as pd
import tensorflow as tf
import keras
from keras.models import Sequential
import numpy as np
import cv2

from keras.models import load_model
from keras import backend as K

app = Flask(__name__)


@app.route("/")
def index():
    return render_template('index.html')


@app.route("/submit",  methods=['POST'])
def get_javascript_data():
    if request.method == "POST":
        data = request.data
        dataDict = json.loads(data)
        img_data = dataDict['imageData64'].split(",")[-1]
        imgdata = base64.b64decode(img_data)
        # I assume you have a way of picking unique filenames
        filename = 'received_image.jpg'
        with open(filename, 'wb') as f:
            f.write(imgdata)

        img_rows, img_cols = 50, 50
        X_train = np.array([np.array(cv2.resize(cv2.imread(
           filename), (img_rows, img_cols)))])
        X_train = X_train.astype('float32')
        X_train /= 255

        model = keras.models.load_model('cnn3.h5')
        config = model.get_config()
        model_new = Sequential.from_config(config)

        y_pred_val = model_new.predict(X_train)
        K.clear_session()

        print(y_pred_val)

        index = np.argmax(y_pred_val[0])
        print(np.argmax(y_pred_val[0]))

        categories = ['footwear', 'hats', 'pants', 'skirts', 'tops']
        print(categories[index])


        resp = Response(status=200, mimetype='application/json')
        resp.headers['category'] = categories[index]

        return resp


    return redirect("/", code=302)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 3000), debug=True)
