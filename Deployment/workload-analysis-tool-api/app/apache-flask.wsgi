#! /usr/bin/python

# from api.main import app as application
# import sys
# sys.path.append("/var/www/apache-flask")

from flask_cors import CORS

import sys
import logging
logging.basicConfig(stream=sys.stderr)
sys.path.insert(0,"/var/www/apache-flask")

from api.main import app as application
