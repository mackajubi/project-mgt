from flask_restplus import reqparse

land_acquisition_parser = reqparse.RequestParser()
land_acquisition_parser.add_argument('Project', type=int, required=True)

put_land_acquisition_parser = reqparse.RequestParser()
put_land_acquisition_parser.add_argument('LandID', type=int, required=True)
put_land_acquisition_parser.add_argument('ProjectID', type=int, required=True)
put_land_acquisition_parser.add_argument('LandValued', type=str, required=True)
put_land_acquisition_parser.add_argument('LandAcquired', type=str, required=True)
put_land_acquisition_parser.add_argument('PAPsValued', type=str, required=True)
put_land_acquisition_parser.add_argument('PAPsPaid', type=str, required=True)
put_land_acquisition_parser.add_argument('AmountApproved', type=str, required=True)
put_land_acquisition_parser.add_argument('AmountPaid', type=str, required=True)
put_land_acquisition_parser.add_argument('KMsAcquired', type=str, required=True)