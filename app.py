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

@app.route('/analysisExamps')
def analysispage():
    return render_template('analysisExamps.html')

@app.route('/powerExamps')
def powerpage():
    return render_template('powerExamps.html')
  
@app.route('/softTrain')
def softwarepage():
    return render_template('softwareTrain.html')

@app.route('/workshops')
def workshoppage():
    return render_template('workshops.html')

@app.route('/tutorials')
def tutorialpage():
    return render_template('tutorials.html')

@app.route('/tools')
def toolspage():
    return render_template('tools.html')

@app.route('/distributions')
def distnpage():
    return render_template('distributions.html')

@app.route('/sampleSizeCalculations')
def sampleSizepage():
    return render_template('sampleSizeCalculations.html')

@app.route('/randomizations')
def randomizationspage():
    return render_template('randomizations.html')

if __name__ == '__main__':
    app.run('0.0.0.0',debug=True)
