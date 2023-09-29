from flask_restplus import Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from api.apis.Workload.models import api, workload_model, excel_workload_model
from api.helpers import utils


#########################################################################################
#                                                                                       #
#                                     Models                                            #
#                                                                                       #
#########################################################################################
create_workload  = api.model('Create A Workload', workload_model)
upload_excel_workload  = api.model('Upload Excel Workload', excel_workload_model)


#########################################################################################
#                                                                                       #
#                                 Endpoints                                             #
#                                                                                       #
#########################################################################################
@api.route('/CreateWorkload')
class CreateWorkload(Resource):
    @jwt_required
    @api.response(200, 'OK')
    @api.response(400, 'Validation error')
    @api.expect(create_workload)
    def post(self):
        payload = api.payload

        current_user = get_jwt_identity()
        
        # Save the Tasks
        Tasks = payload['Tasks']
        success = 0
        for task in Tasks:

            sp_stmt = """exec InsEmployeeTask 
                    @TaskName = ?,
                    @Volume = ?,
                    @UnitOfMeasure = ?,
                    @TaskOutput = ?,
                    @Frequency = ?,
                    @NatureOfTask = ?,
                    @NoOfProjects = ?,
                    @TimeToComplete = ?,
                    @CongnitiveDemand = ?,
                    @PhysicalDemand = ?,
                    @ComplianceDemand = ?,
                    @CollaborativeDemand = ?,
                    @SeasonalDemand = ?,
                    @Impact = ?,
                    @LevelOfSkillRequired = ?,
                    @RelevanceOfTask = ?,
                    @TaskImprovement = ?,
                    @Email = ?
                """
            results = utils._do_update_or_insert(sp_stmt, (
                task['TaskName'],
                task['Volume'],
                task['UnitOfMeasure'],
                task['Output'],
                task['Frequency'],
                task['NatureOfTask'],
                int(task['NoOfProjects']),
                int(task['TimeToComplete']),
                task['CongnitiveDemand'],            
                task['PhysicalDemand'],            
                task['ComplianceDemand'],            
                task['CollaborativeDemand'],            
                task['SeasonalDemand'],            
                task['Impact'],            
                task['LevelOfSkillRequired'],            
                task['RelevanceOfTask'],            
                task['TaskImprovement'],            
                current_user['WorkEmail'],
            ))

            if results["status"] and results['rowcount'] == 1: 
                success += 1

        if success == len(Tasks):

            # Save the Addition Questions
            sp_stmt = """exec InsAdditionalQns 
                    @HasWorkloadIncreased = ?,
                    @MajorCaseOfWorkloadChange = ?,
                    @ChallengesInManagingWorkload = ?,
                    @EffectivenessWhenWorkingFromHome = ?,
                    @ShouldUNRAContinueWorkFromHome = ?,
                    @ReasonsForRecommendation = ?,
                    @ControlsForWorkFromHomeEffectiveness = ?,
                    @OtherWorkStaffCanDo = ?,
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
                current_user['WorkEmail'],
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

@api.route('/UploadExcel')
class UploadExcel(Resource):
    @api.response(200, 'OK')
    @api.response(400, 'Validation error')
    @api.expect(upload_excel_workload)
    def post(self):
        payload = api.payload
        
        # Get the employee details
        employee = utils._get_employee_details(employee_id=payload['EmployeeId'])
        if not len(employee):
            return {
                'message': 'Operation Failed. The staff details could not be found. Please confirm that you have written the correct Staff ID Number and try again.', 
                'code': 400,
                'data':""
            }, 400
        
        # Check if the employee has not submitted yet.
        if utils._check_if_employee_submitted(email=employee['WorkEmail']):
            return {
                'message': 'Operation Failed. The Employee has already submitted their Workload Analysis.', 
                'code': 400,
                'data':""
            }, 400            

        # Save the Tasks
        Tasks = payload['Tasks']
        success = 0
        for task in Tasks:

            sp_stmt = """exec InsEmployeeTask 
                    @TaskName = ?,
                    @Volume = ?,
                    @UnitOfMeasure = ?,
                    @TaskOutput = ?,
                    @Frequency = ?,
                    @NatureOfTask = ?,
                    @NoOfProjects = ?,
                    @TimeToComplete = ?,
                    @CongnitiveDemand = ?,
                    @PhysicalDemand = ?,
                    @ComplianceDemand = ?,
                    @CollaborativeDemand = ?,
                    @SeasonalDemand = ?,
                    @Impact = ?,
                    @LevelOfSkillRequired = ?,
                    @RelevanceOfTask = ?,
                    @TaskImprovement = ?,
                    @Imported = ?,
                    @Email = ?
                """
            results = utils._do_update_or_insert(sp_stmt, (
                task['TaskName'],
                task['Volume'],
                task['UnitOfMeasure'],
                task['Output'],
                task['Frequency'],
                task['NatureOfTask'],
                (int(task['NoOfProjects']) if task['NoOfProjects'] != '' else 0),
                (int(task['TimeToComplete']) if task['TimeToComplete'] != '' else 0),
                task['CongnitiveDemand'],            
                task['PhysicalDemand'],            
                task['ComplianceDemand'],            
                task['CollaborativeDemand'],            
                task['SeasonalDemand'],            
                task['Impact'],            
                task['LevelOfSkillRequired'],            
                task['RelevanceOfTask'],            
                task['TaskImprovement'], 
                'Yes',           
                employee['WorkEmail'],
            ))

            if results["status"] and results['rowcount'] == 1: 
                success += 1

        if success == len(Tasks):

            # Save the Addition Questions
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

