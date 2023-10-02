from flask_restplus import Namespace, Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity    
)
from helpers import utils
from apis.LandAcquisition.parsers import land_acquisition_parser, put_land_acquisition_parser
from apis.LandAcquisition.models import land_acquisition_model

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

        sp_stmt = "exec getLandAcquisition @ProjectID=?"

        results = utils._do_select(sp_stmt, (payload['Project']))
        
        if results["status"] and len(results['data']):  

            data = utils._object(results['data'], [
                "LandID",
                "LandValued",
                "LandAcquired",
                "PAPsValued",
                "PAPsPaid",
                "AmountApproved",
                "AmountPaid",
                "KMsAcquired"
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

        print('payload:', payload)      

        current_user = get_jwt_identity()    

        return {
            'message': 'Operation Successful. Project information updated.', 
            'code': 200, 
            'data': ""
        }, 200        

        sp_stmt = """exec updateProjects 
                @ProjectID = ?,
                @ProjectNumber = ?,
                @ProjectName = ?,
                @RoadLength = ?,
                @SurfaceType = ?,
                @ProjectManager = ?,
                @ProjectEngineer = ?,
                @WorksSignatureDate = ?,
                @CommencementDate = ?,
                @WorksCompletionDate = ?,
                @RevisedCompletionDate = ?,
                @SupervisingConsultant = ?,
                @SupervisionSignatureDate = ?,
                @SupervisionCompletionDate = ?,
                @SupervisingConsultantContractAmount = ?,
                @RevisedSCContractAmount = ?,
                @SupervisionProcurementNumber = ?,
                @WorksContractAmount = ?,
                @RevisedWorksContractAmount = ?,
                @WorksContractor = ?,
                @WorksProcurementNumber = ?,
                @ProjectTypeID = ?,
                @ProjectFunderID = ?,	
                @UpdatedBy = ?
        """
        results = utils._do_update_or_insert(sp_stmt, (
			payload['ProjectID'],
			payload['ProjectNumber'],
			payload['ProjectName'],
			payload['RoadLength'],
			payload['SurfaceType'],
			payload['ProjectManager'],
			payload['ProjectEngineer'],
			payload['WorksSignatureDate'],
			payload['CommencementDate'],
			payload['WorksCompletionDate'],
			payload['RevisedCompletionDate'],
			payload['SupervisingConsultant'],
			payload['SupervisionSignatureDate'],
			payload['SupervisionCompletionDate'],
			payload['SupervisingConsultantContractAmount'],
			payload['RevisedSCContractAmount'],
			payload['SupervisionProcurementNumber'],
			payload['WorksContractAmount'],
			payload['RevisedWorksContractAmount'],
			payload['WorksContractor'],
			payload['WorksProcurementNumber'],
			payload['ProjectTypeID'],
			payload['ProjectFunderID'],	
            current_user['UserName']
        ))

        print('results:---', results)

        if results["status"] and results['rowcount'] == 1:
            return {
                'message': 'Operation Successful. Project information updated.', 
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

        print('payload:', payload)      

        current_user = get_jwt_identity()    

        return {
            'message': 'Operation Successful. Project information updated.', 
            'code': 200, 
            'data': ""
        }, 200        

        sp_stmt = """exec updateProjects 
                @ProjectID = ?,
                @ProjectNumber = ?,
                @ProjectName = ?,
                @RoadLength = ?,
                @SurfaceType = ?,
                @ProjectManager = ?,
                @ProjectEngineer = ?,
                @WorksSignatureDate = ?,
                @CommencementDate = ?,
                @WorksCompletionDate = ?,
                @RevisedCompletionDate = ?,
                @SupervisingConsultant = ?,
                @SupervisionSignatureDate = ?,
                @SupervisionCompletionDate = ?,
                @SupervisingConsultantContractAmount = ?,
                @RevisedSCContractAmount = ?,
                @SupervisionProcurementNumber = ?,
                @WorksContractAmount = ?,
                @RevisedWorksContractAmount = ?,
                @WorksContractor = ?,
                @WorksProcurementNumber = ?,
                @ProjectTypeID = ?,
                @ProjectFunderID = ?,	
                @UpdatedBy = ?
        """
        results = utils._do_update_or_insert(sp_stmt, (
			payload['ProjectID'],
			payload['ProjectNumber'],
			payload['ProjectName'],
			payload['RoadLength'],
			payload['SurfaceType'],
			payload['ProjectManager'],
			payload['ProjectEngineer'],
			payload['WorksSignatureDate'],
			payload['CommencementDate'],
			payload['WorksCompletionDate'],
			payload['RevisedCompletionDate'],
			payload['SupervisingConsultant'],
			payload['SupervisionSignatureDate'],
			payload['SupervisionCompletionDate'],
			payload['SupervisingConsultantContractAmount'],
			payload['RevisedSCContractAmount'],
			payload['SupervisionProcurementNumber'],
			payload['WorksContractAmount'],
			payload['RevisedWorksContractAmount'],
			payload['WorksContractor'],
			payload['WorksProcurementNumber'],
			payload['ProjectTypeID'],
			payload['ProjectFunderID'],	
            current_user['UserName']
        ))

        print('results:---', results)

        if results["status"] and results['rowcount'] == 1:
            return {
                'message': 'Operation Successful. Project information updated.', 
                'code': 200, 
                'data': ""
            }, 200

        return {
            'message': 'Operation Failed.', 
            'code': 400,
            'data':""
        }, 400



