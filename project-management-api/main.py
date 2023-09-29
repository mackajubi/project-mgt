from flask import Flask,jsonify
from flask_cors import CORS

from apis import api
from config import app,jwt
from helpers import utils

import os

@jwt.expired_token_loader
def my_expired_token_callback(expired_token):
    """
        The functions is executed when a user
        access a procted endpoint with an 
        invalid token
    """    
    token_type = expired_token['type']
    return jsonify({
        'status': 401,
        'message': 'The {} token has expired'.format(token_type)
    }), 401

@jwt.unauthorized_loader
def my_unauthorized_loader_callback(empty):
    """
        The function is executed when a user tries to access
        any protected endpoints without a token
    """    
    return jsonify({
        'status': 401,
        'message': 'The token is Missing'
    }), 401

@app.after_request
def after_request(response):
    """
        The function is executed by the api after every request
        it processes for logging api requests.
    """
    status = response.status
    status_code = response.status_code
    utils._log_access_requests(status,status_code)
    return response

@api.errorhandler(Exception)
def error_handler(error):
    """
        The function is executed whenever an exception is raised 
        by any of the endpoints      
    """
    utils._exception_handler(error)
    return {'message': str(error)}

def create_app():
    api.init_app(app)
    HOST = os.environ.get('SERVER_HOST', '0.0.0.0')
    app.run(HOST, 1014, debug = True)

if __name__ == '__main__':
    create_app()
