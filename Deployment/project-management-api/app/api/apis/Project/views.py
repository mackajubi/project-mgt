from flask_restplus import Namespace, Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity    
)
from api.helpers import utils
from api.apis.Project.parsers import (
    project_parser,
    get_project_parser,
    get_project_by_ref_parser
)
from api.apis.Project.models import project_model

api = Namespace('Projects', description='Project endpoints.')

#########################################################################################
#                                                                                       #
#                                     Models                                            #
#                                                                                       #
#########################################################################################
update_project  = api.model('Create A Project', project_model)


#########################################################################################
#                                                                                       #
#                                 Endpoints                                             #
#                                                                                       #
#########################################################################################
@api.route('')
class Project(Resource):
    @jwt_required
    @api.response(200, 'OK')
    @api.response(400, 'Validation error')
    @api.expect(project_parser)
    def get(self):

        payload = project_parser.parse_args()

        data = []

        sp_stmt = "exec getProjects @ProjectTypeID=?"

        results = utils._do_select(sp_stmt, (payload['Project']))
        
        if results["status"] and len(results['data']):  

            data = utils._object(results['data'], [
                "ProjectID",
                "ProjectNumber",
                "ProjectName",
                "RoadLength",
                "SurfaceType",
                "ProjectManager",
                "ProjectEngineer",
                "WorksSignatureDate",
                "CommencementDate",
                "WorksCompletionDate",
                "RevisedCompletionDate",
                "SupervisionSignatureDate",
                "SupervisionCompletionDate",
                "SupervisingConsultantContractAmount",
                "RevisedSCContractAmount",
                "SupervisingConsultant",
                "SupervisionProcurementNumber",
                "WorksContractAmount",
                "RevisedWorksContractAmount",
                "WorksContractor",
                "WorksProcurementNumber",
                "ProjectTypeID",
                "ProjectType",
                "ProjectFunderID",
                "ProjectStatus",
                "HasLandAcquisitionData"
            ], True)

        return {
            'message': 'Operation Successful.', 
            'code': 200, 
            'data': data,
        }, 200
    
    @jwt_required
    @api.response(200, 'OK')
    @api.response(400, 'Validation error')
    @api.expect(update_project)
    def post(self):
        payload = api.payload

        print('payload:', payload)      

        current_user = get_jwt_identity()    

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

@api.route('/GetProject')
class Project(Resource):
    @jwt_required
    @api.response(200, 'OK')
    @api.response(400, 'Validation error')
    @api.expect(get_project_parser)
    def get(self):

        payload = get_project_parser.parse_args()

        data = []

        sp_stmt = "exec getProjects @ProjectNumber=?"

        results = utils._do_select(sp_stmt, (payload['Project']))
        
        if results["status"] and len(results['data']):  

            data = utils._object(results['data'], [
                "ProjectID",
                "ProjectNumber",
                "ProjectName",
                "RoadLength",
                "SurfaceType",
                "ProjectManager",
                "ProjectEngineer",
                "WorksSignatureDate",
                "CommencementDate",
                "WorksCompletionDate",
                "RevisedCompletionDate",
                "SupervisionSignatureDate",
                "SupervisionCompletionDate",
                "SupervisingConsultantContractAmount",
                "RevisedSCContractAmount",
                "SupervisingConsultant",
                "SupervisionProcurementNumber",
                "WorksContractAmount",
                "RevisedWorksContractAmount",
                "WorksContractor",
                "WorksProcurementNumber",
                "ProjectTypeID",
                "ProjectType",
                "ProjectFunderID",
                "ProjectStatus",
                "HasLandAcquisitionData"
            ], True)

        return {
            'message': 'Operation Successful.', 
            'code': 200, 
            'data': data,
        }, 200
    

@api.route('/GetProjectByReferenceNumber')
class GetProjectByReferenceNumber(Resource):
    # @jwt_required
    @api.response(200, 'OK')
    @api.response(400, 'Validation error')
    @api.expect(get_project_by_ref_parser)
    def get(self):

        payload = get_project_by_ref_parser.parse_args()

        data = []

        sp_stmt = "exec getProjectByReferenceNumber @ProcurementNumber=?"

        results = utils._do_select(sp_stmt, (payload['ReferenceNumber']))
        
        if results["status"] and len(results['data']):  

            data = utils._object(results['data'], [
                "ProjectManager",
                "ProjectEngineer"
            ], True)

        return {
            'message': 'Operation Successful.', 
            'code': 200, 
            'data': data[0],
        }, 200
    

