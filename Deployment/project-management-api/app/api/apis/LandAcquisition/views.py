from flask_restplus import Namespace, Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity    
)
from api.helpers import utils
from api.apis.LandAcquisition.parsers import land_acquisition_parser, put_land_acquisition_parser
from api.apis.LandAcquisition.models import land_acquisition_model

api = Namespace('Land Acquisition', description='LandAcquisition endpoints.')

#########################################################################################
#                                                                                       #
#                                     Models                                            #
#                                                                                       #
#########################################################################################
create_land_acquisition  = api.model('Create A Land Acquisition Record', land_acquisition_model)


#########################################################################################
#                                                                                       #
#                                 Endpoints                                             #
#                                                                                       #
#########################################################################################
@api.route('')
class LandAcquisition(Resource):
    @jwt_required
    @api.response(200, 'OK')
    @api.response(400, 'Validation error')
    @api.expect(land_acquisition_parser)
    def get(self):

        payload = land_acquisition_parser.parse_args()

        data = []

        sp_stmt = "exec getLandAcquisition @ProjectNumber=?"

        results = utils._do_select(sp_stmt, (payload['Project']))
        
        if results["status"] and len(results['data']):  

            data = utils._object(results['data'], [
                "LandID",
                "Duration",
                "LandValued",
                "LandAcquired",
                "PAPsValued",
                "PAPsPaid",
                "AmountApproved",
                "AmountPaid",
                "KMsAcquired",
                "ProjectID",
                "Status",
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
    @api.expect(create_land_acquisition)
    def post(self):
        payload = api.payload  

        current_user = get_jwt_identity()       

        sp_stmt = """exec createLandAcquisition 
                @ProjectNumber = ?,
                @Duration = ?,
                @LandValued = ?,
                @LandAcquired = ?,
                @PAPsValued = ?,
                @PAPsPaid = ?,
                @AmountApproved = ?,
                @AmountPaid = ?,
                @KMsAcquired = ?,
                @Username = ?
        """
        results = utils._do_update_or_insert(sp_stmt, (
			payload['ProjectNumber'],
			payload['Duration'],
			payload['LandValued'],
			payload['LandAcquired'],
			payload['PAPsValued'],
			payload['PAPsPaid'],
			payload['AmountApproved'],	
			payload['AmountPaid'],	
			payload['KMsAcquired'],	
            current_user['UserName']
        ))

        if results["status"] and results['rowcount'] == 1:
            return {
                'message': 'Operation Successful. Land Acquisition information added.', 
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
    @api.expect(put_land_acquisition_parser)
    def put(self):
        payload = api.payload   

        current_user = get_jwt_identity()       

        sp_stmt = """exec updateLandAcquisition 
                @LandID = ?,
                @ProjectNumber = ?,
                @Duration = ?,
                @LandValued = ?,
                @LandAcquired = ?,
                @PAPsValued = ?,
                @PAPsPaid = ?,
                @AmountApproved = ?,
                @AmountPaid = ?,
                @KMsAcquired = ?,
                @Username = ?
        """
        results = utils._do_update_or_insert(sp_stmt, (
			payload['LandID'],
			payload['ProjectNumber'],
			payload['Duration'],
			payload['LandValued'],
			payload['LandAcquired'],
			payload['PAPsValued'],
			payload['PAPsPaid'],
			payload['AmountApproved'],	
			payload['AmountPaid'],	
			payload['KMsAcquired'],	
            current_user['UserName']
        ))

        if results["status"] and results['rowcount'] == 1:
            return {
                'message': 'Operation Successful. Land Acquisition information updated.', 
                'code': 200, 
                'data': ""
            }, 200

        return {
            'message': 'Operation Failed.', 
            'code': 400,
            'data':""
        }, 400



