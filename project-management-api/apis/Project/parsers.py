from flask_restplus import reqparse

project_parser = reqparse.RequestParser()
project_parser.add_argument('Project', type=int, required=True)

get_project_parser = reqparse.RequestParser()
get_project_parser.add_argument('Project', type=str, required=True)

get_project_by_ref_parser = reqparse.RequestParser()
get_project_by_ref_parser.add_argument('ReferenceNumber', type=str, required=True)