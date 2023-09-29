from flask import request

import pyodbc
import datetime
import decimal
import traceback
import api.config

def pyodbc_connect():
    """
        The function is used to establish a connection to the database.

        Parameters:
            - Driver:
                Type: string
                Description: The database engine driver name
                Default: None

            - server_name:
                Type: string
                Description: The computer running the api database.
                Default: None

            - db_name:
                Type: string
                Description: The name of the database used.
                Default: None

            - UID:
                Type: string
                Description: Database user.
                Default: None

            - password:
                Type: string
                Description: Database user password
                Default: None

        Returns: 
            - con (Database connection)
    """
    try:
        con = pyodbc.connect(
            driver  = api.config.driver,
            server  = api.config.server_name, 
            user    = api.config.uid,
            password= api.config.password,
            database= api.config.db_name
        )
        return con
    except Exception as e:
        err = "mssql::" + str(e)
        _exception_handler(err)   

def _do_select(query = None, values = []):
    """
        The function establishes a connection to the database,
        executes a select sql statement and closes the connection 
        there after. 

        Parameter:
            - query:
                Type: string
                Description: A Select SQL query statement.
                Default: None 
            
            - values:
                Type: List
                Description: An array of values 
                Default: []


        Returns:
            - result (sql result statement)
    """
    if query is not None:
        _conn = None
        try:
            _conn = pyodbc_connect()
            cursor = _conn.cursor()
            cursor.execute(query, values)
            result = cursor.fetchall()
            return { 'data': result, 'status': True, 'message': 'Operation Successful' }
        except Exception as e:
            err = "mssql::" + str(e)
            _exception_handler(err)
            return { 'data': None, 'status': False, 'message': e }
        finally:
            if _conn is not None: _conn.close()

def _do_update_or_insert(query = None, values = ()):
    """
        The function establishes a connection to the database,
        executes an update/insert sql statement and closes the connection 
        there after. 

        Parameter:
            - query:
                Type: string
                Description: An Update / Delete SQL query statement.
                Default: None
            
            - values:
                Type: List
                Description: An array of values 
                Default: []                

        Returns:
            - result (sql result statement)
    """
    if query is not None:
        _conn = None
        try:
            _conn = pyodbc_connect()
            cursor = _conn.cursor()
            cursor.execute(query, values)
            _conn.commit()
            if cursor.rowcount:
                return { 'status': True, 'message': 'Operation Successful', 'rowcount': cursor.rowcount }
            return { 'status': False, 'message': 'Operation failed', 'rowcount': cursor.rowcount }
        except Exception as e:
            err = "mssql::" + str(e)
            _exception_handler(err)
            error_message = ''
            if 'Cannot insert duplicate key row in object' in str(e): error_message = 'This record already exists.'
            elif 'converting date and/or time' in str(e): error_message = 'Invalid date/time.'
            return { 'status': False, 'message': error_message, 'rowcount': 0 }
        finally:
            if _conn is not None: _conn.close()

def _object(dataset = None, field_names = None, check_type = True):
    """
        The function generates an object with key -> value items based
        on the dataset and field names provided.

        Parameters:
            - dataset:
                Type: List / Dict
                Description: Object values
                Default: None

            - field_names:
                Type: List
                Description: Object keys.
                Default: None

        Returns:
            - object {key -> values}
    """
    try:
        if dataset != None and field_names != None:
            size = len(dataset)
            dataList = []

            if size == 0:
                itemDict = {}
                itemDict[0] = 'none'
                dataList.append(itemDict) 

            else:
                for item in dataset:
                    itemDict = {}
                    Type = ''
                    for x in range(len(field_names)):
                        if check_type and (isinstance(item[x], datetime.datetime) or isinstance(item[x], decimal.Decimal)) :
                            itemDict[field_names[x]] = str(item[x])
                        else:
                            itemDict[field_names[x]] = item[x]
                    dataList.append(itemDict)

            return dataList
        else:
            return None
    except Exception as e:
        _exception_handler(e)

def _log_access_requests(message = None, status_code = None):
    """
        The function logs API access requests.

        Parameters:
            - message:
                Type: string
                Description: Informative message
                Default: None

            - status_code:
                Type: integer
                Description: Standard HTTP Error code
                Default: None
    """
    if status_code != 500:
        ts = datetime.datetime.now().strftime('%d/%b/%Y %H:%M:%S')
        string = request.remote_addr + " - - ["+ ts +"]  \""+ request.method +" "+ request.full_path +" "+ request.scheme + "\" " + message + '~'
        file = open(config.logs_requests,'a+')
        file.write(string+"\n")
        file.close()

def _exception_handler(error_message = None):
    """
        The function logs API exceptions in the following files
            - error.log
            - mssql.log

        Parameters:
            - error_message:
                Type: string
                Description: Raised Execution
                Default: None

            - return_flag:
                Type: boolean
                Description: Determines whether to return the generated error message or the default server message.
                Default: None

            - code:
                Type: integer
                Description: Standard HTTP Error code
                Default: 500

        Returns:
            - JSON Response
    """
    if error_message is not None:
        ts = datetime.datetime.now().strftime('%d/%b/%Y %H:%M:%S')
        tb = traceback.format_exc()
        error_message = str(error_message)

        if error_message.startswith('mssql::'):
            string =  request.remote_addr + " - - ["+ ts +"]  \""+ request.method +" "+ request.full_path +" "+ request.scheme +"\" \n" +tb + '~'
            file = open(api.config.logs_db_server_errors,'a+')
            file.write(string+"\n")
            file.close()
        else:
            string = request.remote_addr + " - - ["+ ts +"]  \""+ request.method +" "+ request.full_path +" "+ request.scheme +"\" \n"+ error_message +" "+ "\n" +tb + '~'
            file = open(api.config.logs_exceptions,'a+')
            file.write(string+"\n")
            file.close()
        
def _get_role_permissions(role_id = None):
    """
        The function retrieves all the permissions associated with 
        a given role id.

        Parameters:
            - role_id
                Type: int
                Description: The role Identifier
                Default: None

        Returns:
            - data: List
    """
    try:
        data = []

        sp_stmt = "exec CRUD_Role @QueryFlag=?, @RoleId=?"

        results = _do_select(sp_stmt, (5, role_id))
        
        if results["status"] and len(results['data']):
            
            for item in results['data']:
                data.append(item[1])    

        return data
    except Exception as e:
        _exception_handler(e)
        return []

def _get_employee_details(employee_id = None):
    """
        The function retrieves employee bio data details.

        Parameters:
            - employee_id
                Type: string
                Description: The employee id number
                Default: None

        Returns:
            - data: List
    """
    try:
        data = {}
        if employee_id is not None:

            sp_stmt = "exec getEmployeeDetails @EmployeeId=?"

            results = _do_select(sp_stmt, (employee_id))
            
            if results["status"] and len(results['data']):
                data = {
                    'WorkEmail': results['data'][0][0]
                } 

        return data
    except Exception as e:
        _exception_handler(e)
        return []

def _check_if_employee_submitted(email = None):
    """
        The function returns the count of submissions
        made by the employee.

        Parameters:
            - email
                Type: string
                Description: The employee work email
                Default: None

        Returns:
            - data: List
    """
    try:
        status = False
        if email is not None:

            sp_stmt = "exec checkIfEmployeeSubmitted @Email=?"

            results = _do_select(sp_stmt, (email))
            
            if results["status"] and len(results['data']):
                status = (True if results['data'][0][0] > 0 else False)
                
        return status
    except Exception as e:
        _exception_handler(e)
        return []

def _get_total_submissions_summary():
    """
        The function returns a summary of submissions such as:
            - Total Submissions
            - Remaining Submissions
            - Online Submissions
            - Excel Uploads

        Parameters:
            - None

        Returns:
            - data: Object

    """
    try:
        data = {}

        sp_stmt = "exec getTotalSubmissionsSummary"

        results = _do_select(sp_stmt)
        
        if results["status"] and len(results['data']):
            data = {
                'TotalResponses' : results['data'][0][0],
                'RemainingSubmissions' : results['data'][0][1],
                'OnlineSubmissions' : results['data'][0][2],
                'ExcelUploads' : results['data'][0][3],
                'CompletionPercentage' : ((results['data'][0][0] / (results['data'][0][0] + results['data'][0][1])) * 100),
            }
            
        return data
    except Exception as e:
        _exception_handler(e)
        return []

def _get_total_submissions_by_directorate():
    """
        The function returns a summary of submissions
        per directorate.

        Parameters:
            - None

        Returns:
            - data: Object

    """
    try:
        data = {}

        sp_stmt = "exec getTotalSubmissionsByDirectorate"

        results = _do_select(sp_stmt)
        
        if results["status"] and len(results['data']):
            data = _object(results['data'],[
                'label',
                'count'
            ])
            
        return data
    except Exception as e:
        _exception_handler(e)
        return []

def _get_total_submissions_by_department():
    """
        The function returns a summary of submissions
        per department.

        Parameters:
            - None

        Returns:
            - data: Object

    """
    try:
        data = {}

        sp_stmt = "exec getTotalSubmissionsByDepartment"

        results = _do_select(sp_stmt)
        
        if results["status"] and len(results['data']):
            data = _object(results['data'],[
                'label',
                'count'
            ])
            
        return data
    except Exception as e:
        _exception_handler(e)
        return []

def _get_workload_analysis_submissions_summary():
    """
        The function returns a brief datailed summary of 
        all the submissions.

        Parameters:
            - None

        Returns:
            - data: List

    """
    try:
        data = []

        sp_stmt = "exec getWorkloadAnalysisSubmissionsSummary"

        results = _do_select(sp_stmt)
        
        if results["status"] and len(results['data']):
            data = _object(results['data'],[
                'EmployeeID',
                'Employee',
                'Email',
                'Position',
                'DutyStation',
                'Department',
                'Directorate',
                'Imported',
                'CreateDate'
            ], check_type = True)
            
        return data
    except Exception as e:
        _exception_handler(e)
        return []

def _get_workload_analysis_submissions(Directorate = 'ALL', Departments = '', JobTitles = ''):
    """
        The function extracts all the workload analysis
        entries submitted.

        Parameters:
            - None

        Returns:
            - data: List

    """
    try:
        data = []

        sp_stmt = "exec getWorkloadAnalysisSubmissionsAdditionalQns_copy1 @Directorate=?, @Departments=?, @JobTitles=?"

        results = _do_select(sp_stmt, (Directorate, Departments, JobTitles))
        
        if results["status"] and len(results['data']):

            data = _object(results['data'],[
                'CreateDate',
                'FullName',
                'StaffNo',
                'JobTitle',
                'SalaryGrade',
                'HasWorkloadIncreased',
                'MajorCaseOfWorkloadChange',
                'ChallengesInManagingWorkload',
                'EffectivenessWhenWorkingFromHome',
                'ShouldUNRAContinueWorkFromHome',
                'ReasonsForRecommendation',
                'ControlsForWorkFromHomeEffectiveness',
                'OtherWorkStaffCanDo',
                'Tasks',
                'Department',
                'Directorate'
            ], check_type = True)  

            for row in data:

                sp_stmt = "exec getWorkloadAnalysisSubmissionsTasks_copy1 @Email=?"

                results_tasks = _do_select(sp_stmt, (row['Tasks']))

                if results_tasks["status"] and len(results_tasks['data']): 
                    tasks = _object(results_tasks['data'],[
                        'TaskName',
                        'Volume',
                        'UnitOfMeasure',
                        'TaskOutput',
                        'Frequency',
                        'NatureOfTask',
                        'NoOfProjects',
                        'TimeToComplete',
                        'TotalTimeToCompleteTask',
                        'CognitiveDemand',
                        'PhysicalDemand',
                        'ComplianceDemand',
                        'CollaborativeDemand',
                        'SeasonalDemand',
                        'Impact',
                        'LevelOfSkillRequired',
                        'RelevanceOfTask',
                        'TaskImprovement'
                    ], check_type = True)            

                    row['Tasks'] = tasks
                         
            
        return data
    except Exception as e:
        _exception_handler(e)
        return []

def _get_directorate_job_titles(Directorate = ''):
    """
        The function extracts all the job titles in those
        directorates

        Parameters:
            - Directorate

        Returns:
            - data: List

    """
    try:
        data = []

        sp_stmt = "exec getDepartmentJobTitles @Directorate=?"

        results = _do_select(sp_stmt, (Directorate))
        
        if results["status"] and len(results['data']):

            data = _object(results['data'],[
                'job',
                'department'
            ])  

        return data
    except Exception as e:
        _exception_handler(e)
        return []

