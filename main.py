# import os
# import logging
import requests
from flask import Flask, render_template, jsonify

from DeribitClasses import DeribitAccount, deribit_api_client

app = Flask(__name__)


# define template folder

app.template_folder = 'static'
app.static_url_path = 'static'


@app.route('/')
def hello_world():
    return 'Ho - ho - ho!'


@app.route('/app')
def main_page():
    return render_template('index.html')


@app.route('/api/options/deribit')
def deribit_api():
    return jsonify(deribit_api_client.index())


# if __name__ == '__main__':
#    app.run(host='0.0.0.0')
#    app.debug = True