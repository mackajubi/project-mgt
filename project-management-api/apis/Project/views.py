from flask_restplus import Namespace, Resource
from flask_jwt_extended import (
    jwt_required
)
from helpers import utils
from apis.Project.parsers import project_parser
from apis.Project.models import project_model

api = Namespace('Projects', description='Project endpoints.')

#########################################################################################
#                                                                                       #
#                                     Models                                            #
#                                                                                       #
#########################################################################################
update_project  = api.model('Create A Workload', project_model)


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
                "ProjectStatus"
            ], True)

        return {
            'message': 'Operation Successful.', 
            'code': 200, 
            'data': data,
        }, 200
    
    @api.response(200, 'OK')
    @api.response(400, 'Validation error')
    @api.expect(update_project)
    def post(self):
        payload = api.payload

        print('payload:', payload)    
        
        return {
            'message': 'Operation Successful.', 
            'code': 200, 
            'data': ""
        }, 200           

        sp_stmt = """exec InsAdditionalQns 
                @HasWorkloadIncreased = ?,
                @MajorCaseOfWorkloadChange = ?,
                @ChallengesInManagingWorkload = ?,
                @EffectivenessWhenWorkingFromHome = ?,
                @ShouldUNRAContinueWorkFromHome = ?,
                @ReasonsForRecommendation = ?,
                @ControlsForWorkFromHomeEffectiveness = ?,
                @OtherWorkStaffCanDo = ?,
                @Imported = ?,
                @Email = ?
            """
        results = utils._do_update_or_insert(sp_stmt, (
            payload['HasWorkloadIncreased'],
            payload['MajorCaseOfWorkloadChange'],
            payload['ChallengesInManagingWorkload'],
            payload['EffectivenessWhenWorkingFromHome'],
            payload['ShouldUNRAContinueWorkFromHome'],
            payload['ReasonsForRecommendation'],
            payload['ControlsForWorkFromHomeEffectiveness'],        
            payload['OtherWorkStaffCanDo'],  
            'Yes',      
            employee['WorkEmail']
        ))

        if results["status"] and results['rowcount'] == 1:
            return {
                'message': 'Operation Successful.', 
                'code': 200, 
                'data': ""
            }, 200

        return {
            'message': 'Operation Failed', 
            'code': 400,
            'data':""
        }, 400



