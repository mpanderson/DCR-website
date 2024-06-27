# -*- coding: utf-8 -*-
"""
Created on Mon Sep  4 06:47:21 2023

@author: mpand
"""

from flask import Flask, render_template, request, jsonify 
import numpy as np
import scipy.stats as stats
import random

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



@app.route('/montyHall')
def montyHallpage():
    return render_template('montyHall.html')

@app.route('/generate_doors', methods=['POST'])
def generate_doors():
    num_doors = int(request.form['num_doors'])
    winner = random.randint(0, num_doors - 1)
    return jsonify({'num_doors': num_doors, 'winner': winner})

@app.route('/reveal_goat', methods=['POST'])
def reveal_goat():
    data = request.get_json()
    num_doors = data['num_doors']
    chosen_door = data['chosen_door']
    winner = data['winner']

    if chosen_door == winner:
        goat_doors = [i for i in range(num_doors) if i != winner]
        revealed_goats = random.sample(goat_doors, num_doors - 2)
    else:
        goat_doors = [i for i in range(num_doors) if i != winner and i != chosen_door]
        revealed_goats = goat_doors

    return jsonify({'revealed_goats': revealed_goats})


@app.route('/simulate', methods=['POST'])
def simulate():
    data = request.json
    num_doors = int(data['num_doors'])
    num_simulations = int(data['num_simulations'])
    stay_wins = 0
    switch_wins = 0

    stay_percentages = []
    switch_percentages = []

    for i in range(num_simulations):
        winner = random.randint(0, num_doors - 1)
        chosen_door = random.randint(0, num_doors - 1)
        if chosen_door == winner:
            stay_wins += 1
        else:
            switch_wins += 1

        stay_percentages.append((stay_wins / (i + 1)) * 100)
        switch_percentages.append((switch_wins / (i + 1)) * 100)

    stay_percentage = (stay_wins / num_simulations) * 100
    switch_percentage = (switch_wins / num_simulations) * 100

    return jsonify({
        'stay_percentage': stay_percentage, 
        'switch_percentage': switch_percentage,
        'stay_percentages': stay_percentages,
        'switch_percentages': switch_percentages
    })


if __name__ == '__main__':
    app.run('0.0.0.0',debug=True)
