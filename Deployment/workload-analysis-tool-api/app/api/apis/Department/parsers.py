from flask_restplus import reqparse

department_parser = reqparse.RequestParser()
department_parser.add_argument('Directorate', type=str, required=True)