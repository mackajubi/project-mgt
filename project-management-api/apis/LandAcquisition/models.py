from flask_restplus import fields

land_acquisition_model = {
    'ProjectID': fields.Integer(required=True),
    'LandValued': fields.String(required=True),
    'LandAcquired': fields.String(required=False),
    'PAPsValued': fields.String(required=True),
    'PAPsPaid': fields.String(required=False),
    'AmountApproved': fields.String(required=True),
    'AmountPaid': fields.String(required=False),
    'KMsAcquired': fields.String(required=False),
}
