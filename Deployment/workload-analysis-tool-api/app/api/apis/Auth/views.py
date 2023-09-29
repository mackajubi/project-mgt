from flask_restplus import Namespace, Resource
from datetime import timedelta
from flask_jwt_extended import (
    create_access_token
)

from api.apis.Auth.models import user_login, sso_user_login

from api.helpers import utils, webservices
from api.config import azureSSO

api = Namespace('User Authetication', description='Authorization endpoints.')

#########################################################################################
#                                                                                       #
#                                     Models                                            #
#                                                                                       #
#########################################################################################
a_user_auth   = api.model('User Auth', user_login)
a_user_sso_auth   = api.model('User SSO Auth', sso_user_login)


#########################################################################################
#                                                                                       #
#                                 Endpoints                                             #
#                                                                                       #
#########################################################################################

@api.route('/login')
class Login(Resource):
    @api.response(200, 'OK')
    @api.response(400, 'Validation error')
    @api.response(401, 'Invalid Username or Password')
    @api.expect(a_user_auth)
    def post(self):
        payload = api.payload
        
        # Authenticate with Active Directory
        ad_auth = webservices._ldapAuth(payload['UserName'],payload['Password'])

        # Compare with local user table
        if ad_auth:
            sp_stmt = "exec CRUD_User @QueryFlag=?, @Email=?"

            results = utils._do_select(sp_stmt, (1, ad_auth['data']['WorkEmail']))

            if results['status'] and len(results['data']):                
                payload = ad_auth['data']
                payload['UserId'] = results['data'][0][0]

                payload["UserRole"] = [
                    {
                        'RoleId': results['data'][0][1], 
                        'Role': results['data'][0][2],
                        'Remarks': results['data'][0][3],
                    }
                ]

                # For Development Purposes
                payload['StationId'] = results['data'][0][4]
                payload['StationCode'] = results['data'][0][5]
                payload['Station'] = results['data'][0][6]
                payload['OnLeave'] = results['data'][0][7]
                payload['DelegatorUserId'] = results['data'][0][9]

                permissions = utils._get_role_permissions(role_id = results['data'][0][1])

                payload["Permissions"] = permissions

                access_token = create_access_token(
                    identity = payload,
                    expires_delta=timedelta(days=5)
                )

                return { 'message': 'User Login Succesful', 'code': 200, 'data': access_token }, 200

            return { 'message': 'Credentials Correct, But you dont have access to this System', 'code': 400 }, 400

        return { 'message': 'Invalid Username or Password', 'code': 401 }, 401


@api.route('/SSO')
class SingleSignOn(Resource):
    @api.response(200, 'OK')
    @api.response(400, 'Validation error')
    @api.response(401, 'Invalid Username or Password')
    @api.expect(a_user_sso_auth)
    def post(self):
        payload = api.payload

        if azureSSO['tenantId'] == payload['Tenant'] and azureSSO['clientId'] == payload['Client']:

            username = payload['UserName'].split('@')

            # Compare with local user table
            sp_stmt = "exec CRUD_User @QueryFlag=?, @Email=?"

            results = utils._do_select(sp_stmt, (1, payload['WorkEmail']))

            if results['status'] and len(results['data']):                
                status, employee = webservices._GetEmployeeDetails(payload['WorkEmail'])

                if status:
                    _payload = employee['data'][0]
                    _payload['UserName'] = username[0]
                    _payload['UserId'] = results['data'][0][0]
                    _payload["UserRole"] = [
                        {
                            'RoleId': results['data'][0][1], 
                            'Role': results['data'][0][2],
                            'Remarks': results['data'][0][3],
                        }
                    ]

                    # For Development Purposes
                    _payload['StationId'] = results['data'][0][4]
                    _payload['StationCode'] = results['data'][0][5]
                    _payload['Station'] = results['data'][0][6]
                    _payload['OnLeave'] = results['data'][0][7]
                    _payload['Submitted'] = results['data'][0][8]    

                    permissions = utils._get_role_permissions(role_id = results['data'][0][1])

                    _payload["Permissions"] = permissions

                    access_token = create_access_token(
                        identity = _payload,
                        expires_delta=timedelta(hours=10)
                    )

                    return { 'message': 'User Login Succesful', 'code': 200, 'data': access_token }, 200

            return { 'message': 'Sorry, But you dont have access to this System', 'code': 400 }, 400

        return { 'message': 'Invalid request', 'code': 401 }, 401

