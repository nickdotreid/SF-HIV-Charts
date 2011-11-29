import xlrd
from database import db_session
from models import Test

def parse_xls(file_location):
	wb = xlrd.open_workbook(file_location)
	sh = wb.sheet_by_index(0)
	keys = sh.row_values(0)
	for rownum in range(sh.nrows):
		if rownum is not 0:
			row = sh.row_values(rownum)
			#matach keys
			dictionary = {}
			for cellnum in range(len(row)):
				dictionary[keys[cellnum]] = row[cellnum]
			yield dictionary
			
def load_xls(file_location):
	data = parse_xls(file_location)
	for row in data:
		test = Test(row['SITEID'],row['GENDER'],row['ETHNICITY'],int(row['AGE']))
		db_session.add(test)
	db_session.commit()