# -*- coding: utf-8 -*-
"""
Created on Mon Sep  4 06:47:21 2023

@author: mpand
"""

from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def homepage():
    return render_template('index.html')

@app.route('/publicData')
def datapage():
    return render_template('publicData.html')

@app.route('/workshops')
def workshoppage():
    return render_template('workshops.html')

if __name__ == '__main__':
    app.run('0.0.0.0',debug=True)
