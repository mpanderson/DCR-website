# -*- coding: utf-8 -*-
"""
Created on Mon Sep  4 06:47:21 2023

@author: mpand
"""

from flask import Flask, render_template, request, jsonify 
import numpy as np
import scipy.stats as stats

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

@app.route('/confidenceInterval')
def confidenceIntervalpage():
    return render_template('confidenceInterval.html')


@app.route('/generate_sample', methods=['POST'])
def generate_sample():
    try:
        data = request.get_json()
        mu = data['mu']
        sigma = data['sigma']
        n = data['n']
        confidence = data['confidence'] / 100

        # Logging input data
        app.logger.debug(f"Received data: mu={mu}, sigma={sigma}, n={n}, confidence={confidence}")

        # Validate inputs
        if not (isinstance(mu, (int, float)) and isinstance(sigma, (int, float)) and isinstance(n, int) and isinstance(confidence, float)):
            raise ValueError("Invalid input types")

        if sigma <= 0 or n <= 0 or not (0 < confidence < 1):
            raise ValueError("Invalid input values")

        # Generate random sample
        sample = np.random.normal(mu, sigma, n)

        # Calculate the sample mean and standard error
        sample_mean = np.mean(sample)
        sample_se = stats.sem(sample)

        # Calculate the confidence interval
        ci = stats.t.interval(confidence, n-1, loc=sample_mean, scale=sample_se)
        lower, upper = ci

        # Check if the interval contains the population mean
        contains_mu = lower <= mu <= upper

        return jsonify(lower=lower, upper=upper, containsMu=bool(contains_mu))

    except Exception as e:
        app.logger.error(f"Error occurred: {e}")
        return jsonify(error=str(e)), 500
if __name__ == '__main__':
    app.run('0.0.0.0',debug=True)
