import requests
import json

def _ldapAuth(username,password):
    url = 'http://192.168.26.135:1001/gen/api/v1.0/ad/auth/'
    # url = 'http://192.168.26.135:1001/gen/api/v1.0/ad/auth/test'
    #http://192.168.26.135:1001/gen/api/v1.0/employees/single?email=ronald.nionzima%40unra.go.ug
    #url = 'http://localhost:90/gen/api/v1.0/ad/auth/'
    myobj = {'UserName': username,'Password':password,"SourceApp":'ccmeeting'}
    headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
    response = requests.post(url, data=json.dumps(myobj), headers=headers)
    jsonResponse = response.json()
    if jsonResponse["code"] == 200:
            return jsonResponse
    else:
        return False


def _GetEmployeeDetails(email):
    url = 'http://192.168.26.135:1001/gen/api/v1.0/employees/single?email='+email
    response = requests.get(url)
    jsonResponse = response.json()
    if jsonResponse["code"] == 200:
        return True, jsonResponse
    else:
        return False, []


def _Procurement():
    url = 'http://192.168.26.135:1001/gen/api/v1.0/procurement'
    response = requests.get(url)
    jsonResponse = response.json()
    if jsonResponse["code"] == 200:
        return jsonResponse
    else:
        return False


def _allStaff():
    url = 'http://192.168.26.135:1001/gen/api/v1.0/employees/all'
    #url = 'http://localhost:90/gen/api/v1.0/employees/all'
    response = requests.get(url)
    jsonResponse = response.json()
    if jsonResponse["code"] == 200:
        return jsonResponse
    else:
        return False


def _SingleStaff():
    url = 'http://192.168.26.135:1001/gen/api/v1.0/employees/all'
    #url = 'http://localhost:90/gen/api/v1.0/employees/single'
    response = requests.get(url)
    jsonResponse = response.json()
    if jsonResponse["code"] == 200:
        return jsonResponse
    else:
        return False


def _UpdateRoleSelf(StaffId,LineManager,RoleId,SubstantiveRoleId):
    url = 'http://192.168.26.84:1013/etlapi/2.2.1/auth/UpdateExpiredAgRoles?StaffId='+str(StaffId)+'&LineManager='+str(LineManager)+'&RoleId='+str(RoleId)+'&SubstantiveRoleId='+str(SubstantiveRoleId)
    #url = 'http://localhost:90/gen/api/v1.0/employees/single'
    response = requests.get(url)
    jsonResponse = response.json()
    if jsonResponse["code"] == 200:
        return jsonResponse
    else:
        return False
