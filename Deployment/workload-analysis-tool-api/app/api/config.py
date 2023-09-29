"""
    The script contains the configuration settings.
"""
from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from werkzeug.contrib.fixers import ProxyFix
from flask_jwt_extended import JWTManager
from flask_restplus import Api

import os
import logging

authorizations = {
    'Bearer Auth': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization'
    },
}

app = Flask(__name__)
jwt = JWTManager(app)
app.wsgi_app = ProxyFix(app.wsgi_app)

# Cross browser origin resource sharing
CORS(app)

api = Api(
    title='Workload Analysis Tool',
    version='0.0.1',
    description='Workload analysis tool API',
    doc='/documentation',
    validate=True,
    security='Bearer Auth',
    authorizations=authorizations,
    prefix='/WorkloadAnalysis'
)


app_root = os.path.dirname(os.path.abspath(__file__))

logs_folder = os.path.join(app_root,'logs')
logs_requests = os.path.join(logs_folder,'requests.log')
logs_exceptions = os.path.join(logs_folder,'errors.log')
logs_db_server_errors = os.path.join(logs_folder,'mssql.log')

# Create file handlers
requests_handler = logging.FileHandler(logs_requests)
requests_handler.setLevel(logging.INFO)
error_handler = logging.FileHandler(logs_exceptions)
error_handler.setLevel(logging.ERROR)

# Register the Handlers
app.logger.addHandler(error_handler)
app.logger.addHandler(requests_handler)

app.config['SECRET_KEY'] = 'this is a secret'
API_SECRET = 'Another deep secret'

app.config['BUNDLE_ERRORS'] = True
# app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 120
app.config.from_json(os.path.join('resources', 'config.json'))

# Configure flask-mail
app.config.update(dict(
        DEBUG = True,
        MAIL_SERVER = 'smtp.gmail.com',
        MAIL_PORT = 587,
        MAIL_USE_TLS = True,
        MAIL_USE_SSL = False,
        MAIL_USERNAME = '',
        MAIL_PASSWORD = ''
    )
)
mail = Mail(app)


# DATABASE
driver      = os.getenv('DATABASE_DRIVER')
server_name = os.getenv('DATABASE_SERVER')
db_name     = os.getenv('DATABASE_NAME')
uid         = os.getenv('DATABASE_UID')
password    = os.getenv('DATABASE_PWD')

# AZURE DEV TEST SUBSCRIPTION
azureSSO    = {
    "homeAccountId": os.getenv('AZURE_HOME_ACCOUNT_ID'),
    "tenantId": os.getenv('TENANT_ID'),
    "clientId": os.getenv('CLIENT_ID'),
}

# GLOBAL VARIABLE
SERVER_ERROR    = "An error occured, please contact our support team for assistance"
