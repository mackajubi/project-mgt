from flask_restplus import Namespace, Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity    
)
from helpers import utils
from apis.PhysicalProgress.parsers import physical_progress_parser, put_physical_progress_parser
from apis.PhysicalProgress.models import physical_progress_model

api = Namespace('Physical Progress', description='Physical Progress endpoints.')

#########################################################################################
#                                                                                       #
#                                     Models                                            #
#                                                                                       #
#########################################################################################
create_physical_progress  = api.model('Create A Physical Progress Record', physical_progress_model)


#########################################################################################
#                                                                                       #
#                                 Endpoints                                             #
#                                                                                       #
#########################################################################################
@api.route('')
class PhysicalProgress(Resource):
    @jwt_required
    @api.response(200, 'OK')
    @api.response(400, 'Validation error')
    @api.expect(physical_progress_parser)
    def get(self):

        payload = physical_progress_parser.parse_args()

        data = []

        sp_stmt = "exec getPhysicalProgress @ProjectNumber=?"

        results = utils._do_select(sp_stmt, (payload['Project']))
        
        if results["status"] and len(results['data']):  

            data = utils._object(results['data'], [
                "PhysicalID",
                "Duration",
                "PlannedProgress",
                "ActualProgress",
                "CummulativePlannedProgress",
                "CummulativeActualProgress",
                "ProjectID",
                "PhysicalStatus",
                "ModifiedBy",
                "LastModified"
            ], True)

        return {
            'message': 'Operation Successful.', 
            'code': 200, 
            'data': data,
        }, 200
    
    @jwt_required
    @api.response(200, 'OK')
    @api.response(400, 'Validation error')
    @api.expect(create_physical_progress)
    def post(self):
        payload = api.payload  

        print('payload:', payload)

        current_user = get_jwt_identity()       

        sp_stmt = """exec createPhysicalProgress 
                @ProjectNumber = ?,
                @Duration = ?,
                @PlannedProgress = ?,
                @ActualProgress = ?,
                @CummulativePlannedProgress = ?,
                @CummulativeActualProgress = ?,
                @Username = ?
        """
        results = utils._do_update_or_insert(sp_stmt, (
			payload['ProjectNumber'],
			payload['Duration'],
			payload['PlannedProgress'],
			payload['ActualProgress'],
			payload['CummulativePlannedProgress'],
			payload['CummulativeActualProgress'],	
            current_user['UserName']
        ))

        print('results:', results)

        if results["status"] and results['rowcount'] == 1:
            return {
                'message': 'Operation Successful. Physical Progress added.', 
                'code': 200, 
                'data': ""
            }, 200

        return {
            'message': 'Operation Failed.', 
            'code': 400,
            'data':""
        }, 400

    @jwt_required
    @api.response(200, 'OK')
    @api.response(400, 'Validation error')
    @api.expect(put_physical_progress_parser)
    def put(self):
        payload = api.payload   

        current_user = get_jwt_identity()      

        print('payload:', payload)       

        sp_stmt = """exec updatePhysicalProgress 
                @PhysicalID = ?,
                @ProjectNumber = ?,
                @Duration = ?,
                @PlannedProgress = ?,
                @ActualProgress = ?,
                @CummulativePlannedProgress = ?,
                @CummulativeActualProgress = ?,
                @Username = ?
        """
        results = utils._do_update_or_insert(sp_stmt, (
			payload['PhysicalID'],
			payload['ProjectNumber'],
			payload['Duration'],
			payload['PlannedProgress'],
			payload['ActualProgress'],
			payload['CummulativePlannedProgress'],
			payload['CummulativeActualProgress'],	
            current_user['UserName']
        ))

        if results["status"] and results['rowcount'] == 1:
            return {
                'message': 'Operation Successful. Physical Progress information updated.', 
                'code': 200, 
                'data': ""
            }, 200

        return {
            'message': 'Operation Failed.', 
            'code': 400,
            'data':""
        }, 400



