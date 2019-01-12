import os
from flask import Flask, render_template
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


# if __name__ == '__main__':
#    app.run(host='0.0.0.0')
#    app.debug = True

#gg2