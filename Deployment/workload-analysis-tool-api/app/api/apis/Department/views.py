from flask_restplus import Namespace, Resource
from flask_jwt_extended import (
    jwt_required
)
from api.helpers import utils
from api.apis.Department.parsers import department_parser

api = Namespace('Department', description='Department endpoints.')


#########################################################################################
#                                                                                       #
#                                 Endpoints                                             #
#                                                                                       #
#########################################################################################
@api.route('')
class Department(Resource):
    @jwt_required
    @api.response(200, 'OK')
    @api.response(400, 'Validation error')
    @api.expect(department_parser)
    def get(self):
        payload = department_parser.parse_args()

        data = []

        sp_stmt = "exec getDepartments @Directorate=?"

        results = utils._do_select(sp_stmt, (payload['Directorate']))
        
        if results["status"] and len(results['data']):   
            jobs = utils._get_directorate_job_titles(payload['Directorate'])

            data = utils._object(results['data'], [
                'DepartmentCode',
                'DepartmentName'
            ])

        return {
            'message': 'Operation Successful.', 
            'code': 200, 
            'data': data,
            'jobs': jobs
        }, 200
