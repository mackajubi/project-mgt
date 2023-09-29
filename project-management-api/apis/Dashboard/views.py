from flask_restplus import Namespace, Resource
from flask_jwt_extended import (
    jwt_required
)
from helpers import utils
from apis.Dashboard.parsers import workload_analysis_parser

api = Namespace('Dashboard', description='Dashboard endpoints.')


#########################################################################################
#                                                                                       #
#                                 Endpoints                                             #
#                                                                                       #
#########################################################################################
@api.route('')
class Dashboard(Resource):
    @jwt_required
    @api.response(200, 'OK')
    @api.response(400, 'Validation error')
    @api.expect(workload_analysis_parser)
    def get(self):

        payload = workload_analysis_parser.parse_args()

        print('payload:', payload)

        summary = utils._get_total_submissions_summary()
        directorates = utils._get_total_submissions_by_directorate()
        # departments = utils._get_total_submissions_by_department()
        # workload_analysis = utils._get_workload_analysis_submissions_summary()
        workload_analysis_extract = utils._get_workload_analysis_submissions(
            Directorate = payload['Directorate'],
            Departments = payload['Departments'],
            JobTitles = payload['JobTitles'],
        )

        # print('summary:', summary)
        # print('directorates:', directorates)
        # print('departments:', departments)
        # print('workload_analysis_extract:', workload_analysis_extract)

        data = {
            'summary': summary,
            'directorates': directorates,
            # 'departments': departments,
            'workload_analysis': workload_analysis_extract
        }

        return {
            'message': 'Operation Successful.', 
            'code': 200, 
            'data': data
        }, 200
