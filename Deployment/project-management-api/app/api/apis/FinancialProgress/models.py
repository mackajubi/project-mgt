from flask_restplus import fields

financial_progress_model = {
    'ProjectNumber': fields.String(required=True),
    'Duration': fields.String(required=False),
    'PlannedProgress': fields.String(required=True),
    'ActualProgress': fields.String(required=False),
    'CummulativePlannedProgress': fields.String(required=True),
    'CummulativeActualProgress': fields.String(required=False),
}
