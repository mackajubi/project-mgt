from api.apis import api
from api.config import app

@app.after_request
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    header['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-API-KEY'
    header['Access-Control-Allow-Methods'] = 'GET, POST, DELETE, PUT'
    return response

api.init_app(app)

