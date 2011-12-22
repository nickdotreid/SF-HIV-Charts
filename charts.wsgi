import os,sys
os.environ['SFHIV_TESTREQ_SETTINGS'] = '/path/to/settings_conf.py'

sys.path.insert(0,"/path/to/TestReq")
from charts import app as application