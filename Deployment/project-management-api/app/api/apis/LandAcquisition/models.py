from flask_restplus import fields

land_acquisition_model = {
    'ProjectNumber': fields.String(required=True),
    'Duration': fields.String(required=True),
    'LandValued': fields.String(required=True),
    'LandAcquired': fields.String(required=True),
    'PAPsValued': fields.Integer(required=True),
    'PAPsPaid': fields.Integer(required=True),
    'AmountApproved': fields.String(required=True),
    'AmountPaid': fields.String(required=True),
    'KMsAcquired': fields.String(required=True),
}
