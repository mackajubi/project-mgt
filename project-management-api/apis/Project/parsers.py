from flask_restplus import reqparse

project_parser = reqparse.RequestParser()
project_parser.add_argument('Project', type=int, required=True)