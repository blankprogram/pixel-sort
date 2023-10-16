from flask import Flask, request, jsonify, send_from_directory
from PIL import Image
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return open('index.html').read()

def pixel_sort(img):
    # This is a very basic example. You might want to implement a more sophisticated algorithm.
    pixels = list(img.getdata())
    sorted_pixels = sorted(pixels)
    img.putdata(sorted_pixels)
    return img

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
        
        with Image.open(filename) as img:
            sorted_img = pixel_sort(img)
            sorted_img.save(filename)
        
        return jsonify(path=filename)

@app.route('/uploads/<filename>')
def serve_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True)
