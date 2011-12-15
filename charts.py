from flask import Flask, request, render_template, jsonify
from models import *

app = Flask(__name__)
app.config.from_envvar('SFHIV_TESTREQ_SETTINGS')

age_groups = [
	{'min':0,'max':12,'name':'0-12'},
	{'min':13,'max':19,'name':'13-19'},
	{'min':20,'max':29,'name':'20-29'},
	{'min':30,'max':39,'name':'30-39'},
	{'min':40,'max':49,'name':'40-49'},
	{'min':50,'max':290,'name':'50+'}
	]

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/trends')
def sf_trends_rotate():
	return render_template('sf_trends_rotate.html')
	
@app.route('/trends/detail')
def sf_trends():
	return render_template('sf_trends.html')

@app.route('/regional')
def regional():
	return render_template('regional.html')
	
@app.route('/population/config')
def population_map():
	return render_template('population.html')
	
@app.route('/population')
def population_simple_map():
	return render_template('population_simple.html')
	
@app.route('/bar')
def bar_charts():
	return render_template('barchart.html')

@app.route('/testing')
def testing_bar():
	return render_template('testing_bar.html')

@app.route('/testing/treemap')
def testing_treemap():
	return render_template('treemap.html')
	
@app.route('/testing/circle')
def testing_circle():
	return render_template('testing_circle.html')
	
@app.route('/data')
def data():
	results = {}
	for test in Test.query.filter_by(siteID='Methadone').all():
		if test.ethnicity not in results:
			results[test.ethnicity] = {'amount':1}
		else:
			results[test.ethnicity]['amount'] += 1
	return jsonify(results)
	
@app.route('/data/treemap.json',methods=['GET','POST'])
def data_treemap():
	results = {}
	axis = 'ethnicity'
	if request.method == 'POST' and 'axis' in request.form:
		axis = request.form['axis']
	tests = 0
	for test in Test.query.all():
		tests += 1
		key = ""
		if axis == 'ethnicity':
			key = test.ethnicity
		if axis == 'gender':
			key = test.gender
		if axis == 'site':
			key = test.siteID
		if axis == 'age':
			for group in age_groups:
				if test.age >= group['min'] and test.age <= group['max']:
					key = group['name']
		if key == "":
			return False
		
		if key not in results:
			results[key] = {'size':1}
		else:
			results[key]['size'] += 1
		
		if axis != 'siteID':
			if test.siteID == 'Methadone':
				results[key] = add_or_increment('Methadone',results[key])
			else:
				results[key] = add_or_increment('Community Based Organization',results[key])
		if axis != 'gender':
			if test.gender == 'MALE':
				results[key] = add_or_increment('Male',results[key])
			elif test.gender == 'FEMALE':
				results[key] = add_or_increment('Female',results[key])
			else:
				results[key] = add_or_increment('Trans',results[key])
		if axis != 'ethniciy':
			if test.ethnicity == 'WHITE':
				results[key] = add_or_increment('White',results[key])
			if test.ethnicity == 'AFRICAN AMERICAN':
				results[key] = add_or_increment('African American',results[key])
			if test.ethnicity == 'HISPANIC/LATINO':
				results[key] = add_or_increment('Latino',results[key])
			if test.ethnicity == 'ASIAN':
				results[key] = add_or_increment('Asian',results[key])
			if test.ethnicity == 'OTHER':
				results[key] = add_or_increment('Other',results[key])
			if test.ethnicity == 'DECLINED':
				results[key] = add_or_increment('Declined',results[key])
			if test.ethnicity == 'NATIVE AMERICAN':
				results[key] = add_or_increment('Native American',results[key])
		if axis != 'age':
			for group in age_groups:
				if test.age >= group['min'] and test.age <= group['max']:
					results[key] = add_or_increment(group['name'],results[key])
		
	ordered_results = []
	for result in results:
		results[result]['name'] = result
		ordered_results.append(results[result])
	return jsonify({'total':tests,'name':'tests','children':ordered_results})
	
def add_or_increment(key,arr):
	if key not in arr:
		arr[key] = 1
	else:
		arr[key] += 1
	return arr