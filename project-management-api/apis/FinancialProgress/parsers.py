from flask_restplus import reqparse

financial_progress_parser = reqparse.RequestParser()
financial_progress_parser.add_argument('Project', type=str, required=True)

put_financial_progress_parser = reqparse.RequestParser()
put_financial_progress_parser.add_argument('FinancialID', type=int, required=True)
put_financial_progress_parser.add_argument('ProjectNumber', type=str, required=True)
put_financial_progress_parser.add_argument('Duration', type=str, required=True)
put_financial_progress_parser.add_argument('PlannedProgress', type=str, required=True)
put_financial_progress_parser.add_argument('ActualProgress', type=str, required=True)
put_financial_progress_parser.add_argument('CummulativePlannedProgress', type=str, required=True)
put_financial_progress_parser.add_argument('CummulativeActualProgress', type=str, required=True)