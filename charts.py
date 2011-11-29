from flask import Flask, render_template, jsonify
from models import *

app = Flask(__name__)

@app.route('/')
def index():
	return render_template('treemap.html')
	
@app.route('/bar')
def bar_charts():
	return render_template('barchart.html')
	
@app.route('/data')
def data():
	results = {}
	for test in Test.query.filter_by(siteID='Methadone').all():
		if test.ethnicity not in results:
			results[test.ethnicity] = {'amount':1}
		else:
			results[test.ethnicity]['amount'] += 1
	return jsonify(results)
	
@app.route('/data/treemap.json')
def data_treemap():
	results = {}
	for test in Test.query.all():
		if test.ethnicity not in results:
			results[test.ethnicity] = {'size':1,'Methadone':0,'Community Based Organization':0,'Male':0,'Female':0,'Trans':0}
		else:
			results[test.ethnicity]['size'] += 1
		if test.siteID == 'Methadone':
			results[test.ethnicity]['Methadone'] += 1
		else:
			results[test.ethnicity]['Community Based Organization'] += 1
		if test.gender == 'MALE':
			results[test.ethnicity]['Male'] += 1
		elif test.gender == 'FEMALE':
			results[test.ethnicity]['Female'] += 1
		else:
			results[test.ethnicity]['Trans'] += 1
		
	ordered_results = []
	for result in results:
		results[result]['name'] = result
		ordered_results.append(results[result])
	return jsonify({'name':'tests','children':ordered_results})