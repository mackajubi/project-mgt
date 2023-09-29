from flask_restplus import fields


user_login = {
    'UserName': fields.String(required=True, description='The user\'s email', max=25),
    'Password': fields.String(required=True, description='The user\'s password.', max=50),
}

sso_user_login = {
    'UserName': fields.String(required=True, description='The user\'s email', max=25),
    'HomeAccount': fields.String(required=True, description='Returned by MSAL Service', max=100),
    'Tenant': fields.String(required=True, description='Returned by MSAL Service', max=50),
    'Client': fields.String(required=True, description='Returned by MSAL Service', max=50),
    'WorkEmail': fields.String(required=True, description='Returned by MSAL Service', max=100),
}