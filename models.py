from sqlalchemy import Column, Integer, String
from database import Base

class Test(Base):
	__tablename__ = 'tests'
	id = Column(Integer, primary_key=True)
	siteID = Column(String(50))
	gender = Column(String(120))
	ethnicity = Column(String(120))
	age = Column(Integer)

	def __init__(self, siteID=None, gender=None, ethnicity=None, age=None):
		self.siteID = siteID
		self.gender = gender
		self.ethnicity = ethnicity
		self.age = age

	def __repr__(self):
		return '<Test %r>' % (self.id)