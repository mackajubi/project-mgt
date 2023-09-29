from flask_restplus import reqparse

workload_analysis_parser = reqparse.RequestParser()
workload_analysis_parser.add_argument('Directorate', type=str, required=True)
workload_analysis_parser.add_argument('Departments', type=str, required=True)
workload_analysis_parser.add_argument('JobTitles', type=str, required=False)