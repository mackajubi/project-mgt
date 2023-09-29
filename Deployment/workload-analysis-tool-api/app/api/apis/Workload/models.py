from flask_restplus import Namespace, fields

api = Namespace('Workload', description='Workload endpoints.')

task_model = api.model('A Task', {
    'TaskName': fields.String(required=True),
    'Volume': fields.String(required=True),
    'UnitOfMeasure': fields.String(required=True),
    'Output': fields.String(required=True),
    'Frequency': fields.String(required=True),
    'NatureOfTask': fields.String(required=True),
    'NoOfProjects': fields.String(required=True),
    'TimeToComplete': fields.String(required=True),
    'CongnitiveDemand': fields.Integer(required=False),
    'PhysicalDemand': fields.Integer(required=False),
    'ComplianceDemand': fields.Integer(required=False),
    'CollaborativeDemand': fields.Integer(required=False),
    'SeasonalDemand': fields.Integer(required=False),
    'Impact': fields.Integer(required=False),
    'LevelOfSkillRequired': fields.String(required=True),
    'RelevanceOfTask': fields.String(required=True),
    'TaskImprovement': fields.String(required=False),
})

workload_model = {
    'Tasks': fields.List(fields.Nested(task_model)),
    'HasWorkloadIncreased': fields.String(required=True, description='Has Workload Increased'),
    'MajorCaseOfWorkloadChange': fields.String(required=True, description='Major Case Of Workload Change'),
    'ChallengesInManagingWorkload': fields.String(required=True, description='Challenges In Managing Workload'),
    'EffectivenessWhenWorkingFromHome': fields.String(required=True, description='Effectiveness When Working From Home'),
    'ShouldUNRAContinueWorkFromHome': fields.String(required=True, description='Should UNRA Continue Work From Home'),
    'ReasonsForRecommendation': fields.String(required=True, description='Reasons For Recommendation'),
    'ControlsForWorkFromHomeEffectiveness': fields.String(required=True, description='Controls For Work From Home Effectiveness'),   
    'OtherWorkStaffCanDo': fields.String(required=False, description='Other Work Staff Can Do'),   
}

excel_workload_model = {
    'EmployeeId': fields.String(required=True, description='Employee Id Number'),
    'Tasks': fields.List(fields.Nested(task_model)),
    'HasWorkloadIncreased': fields.String(required=True, description='Has Workload Increased'),
    'MajorCaseOfWorkloadChange': fields.String(required=True, description='Major Case Of Workload Change'),
    'ChallengesInManagingWorkload': fields.String(required=True, description='Challenges In Managing Workload'),
    'EffectivenessWhenWorkingFromHome': fields.String(required=True, description='Effectiveness When Working From Home'),
    'ShouldUNRAContinueWorkFromHome': fields.String(required=True, description='Should UNRA Continue Work From Home'),
    'ReasonsForRecommendation': fields.String(required=True, description='Reasons For Recommendation'),
    'ControlsForWorkFromHomeEffectiveness': fields.String(required=True, description='Controls For Work From Home Effectiveness'),   
    'OtherWorkStaffCanDo': fields.String(required=False, description='Other Work Staff Can Do'),      
}
