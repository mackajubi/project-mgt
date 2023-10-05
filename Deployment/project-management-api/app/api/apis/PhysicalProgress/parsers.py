from flask_restplus import reqparse

physical_progress_parser = reqparse.RequestParser()
physical_progress_parser.add_argument('Project', type=str, required=True)

put_physical_progress_parser = reqparse.RequestParser()
put_physical_progress_parser.add_argument('PhysicalID', type=int, required=True)
put_physical_progress_parser.add_argument('ProjectNumber', type=str, required=True)
put_physical_progress_parser.add_argument('Duration', type=str, required=True)
put_physical_progress_parser.add_argument('PlannedProgress', type=str, required=True)
put_physical_progress_parser.add_argument('ActualProgress', type=str, required=True)
put_physical_progress_parser.add_argument('CummulativePlannedProgress', type=str, required=True)
put_physical_progress_parser.add_argument('CummulativeActualProgress', type=str, required=True)