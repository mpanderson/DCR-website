# -*- coding: utf-8 -*-
"""
Created on Mon Sep  4 06:47:21 2023

@author: mpand
"""

from flask import Flask, render_template, request, session 


app = Flask(__name__, static_folder="static")

@app.route('/')
def homepage():
    return render_template('index.html',current_page='/')

@app.route('/publicData')
def datapage():
    return render_template('publicData.html',current_page='publicData')

@app.route('/analysisExamps')
def analysispage():
    return render_template('analysisExamps.html',current_page='analysisExamps')

@app.route('/powerExamps')
def powerpage():
    return render_template('powerExamps.html',current_page='powerExamps')
  
@app.route('/softTrain')
def softwarepage():
    return render_template('softwareTrain.html',current_page='softTrain')

@app.route('/workshops')
def workshoppage():
    return render_template('workshops.html',current_page='workshops')

@app.route('/tutorials')
def tutorialpage():
    return render_template('tutorials.html',current_page='tutorials')

@app.route('/tools')
def toolspage():
    return render_template('tools.html',current_page='tools')

@app.route('/glossary')
def glossarypage():
    return render_template('glossary.html',current_page='glossary')


@app.route('/distributions', methods=['GET', 'POST'])
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
