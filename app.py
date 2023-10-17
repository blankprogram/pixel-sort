from ast import Tuple
import sys
from flask import Flask, request, jsonify, send_from_directory
from PIL import Image
from flask_cors import CORS
import numpy as np
from typing import Callable
import os
import matplotlib.pyplot as plt


def sort_pixels(image: Image, value: Callable, condition: Callable, rotation: int = 0) -> Image:

    pixels = np.rot90(np.array(image), rotation)
    values = value(pixels)
    edges = np.apply_along_axis(lambda row: np.convolve(row, [-1, 1], 'same'), 0, condition(values))
    intervals = [np.flatnonzero(row) for row in edges]

    for row, key in enumerate(values):
        if len(intervals[row]) == 0:
            order = np.argsort(key) 
        else:
            order = np.split(key, intervals[row])
            for index, interval in enumerate(order[1:]):
                order[index + 1] = np.argsort(interval) + intervals[row][index]
            order[0] = range(order[0].size)
            order = np.concatenate(order)

        for channel in range(3):
            pixels[row, :, channel] = pixels[row, order.astype('uint32'), channel]
    return Image.fromarray(np.rot90(pixels, -rotation))




def hue(pixels):
    r, g, b = np.split(pixels, 3, 2)
    return np.arctan2(np.sqrt(3) * (g - b), 2 * r - g - b)[:, :, 0]

def sat(pixels):
    r, g, b = np.split(pixels, 3, 2)
    maximum = np.maximum(r, np.maximum(g, b))
    minimum = np.minimum(r, np.minimum(g, b))
    return ((maximum - minimum) / maximum)[:, :, 0]

def laplace(pixels):
    from scipy.signal import convolve2d
    lum = np.average(pixels, 2) / 255
    return np.abs(convolve2d(lum, np.array([[0, -1, 0],
                                            [-1, 4, -1],
                                            [0, -1, 0]]), 'same'))

def lightness(pixels):
    r, g, b = np.split(pixels, 3, 2)
    maximum = np.maximum(r, np.maximum(g, b))
    minimum = np.minimum(r, np.minimum(g, b))
    return ((maximum + minimum) / 2)[:, :, 0] / 255

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify(error='No file part')
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify(error='No selected file')
    
    if file:
            filename = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(filename)

            with Image.open(filename).convert('RGB') as img:
                
                direction = request.form.get('direction', 'horizontal')
                if direction == 'Right':
                    rotation = 0
                elif direction == 'Down':
                    rotation = 1
                elif direction == 'Left':
                    rotation = 2
                elif direction == 'Up':
                   rotation = 3

                threshold_min = float(request.form.get('threshold_min', 0))
                threshold_max = float(request.form.get('threshold_max', 1))

                sort_method = request.form.get('sort_method', 'average')
            if sort_method == 'hue':
                value_func = hue
            elif sort_method == 'sat':
                value_func = sat
            elif sort_method == 'laplace':
                value_func = laplace
            elif sort_method == 'lightness':
                value_func = lightness
            else:
                value_func = lambda pixels: np.average(pixels, axis=2) / 255
            condition = lambda lum: (lum > np.percentile(lum, threshold_min)) & (lum < np.percentile(lum, threshold_max))
            sorted_img = sort_pixels(img,
                                     value_func,
                                     condition,
                                     rotation)

            sorted_img.save(filename)
            img.close()
            return jsonify(path=filename)

@app.route('/')
def index():
    return open('index.html').read()

@app.route('/uploads/<filename>')
def serve_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True)
