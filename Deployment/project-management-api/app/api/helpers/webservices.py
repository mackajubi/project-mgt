import requests
import json

def _ldapAuth(username,password):
    url = 'https://eservices.unra.go.ug/unramasterapi/ad/auth/'
    myobj = {'UserName': username,'Password':password,"SourceApp":'ccmeeting'}
    headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
    response = requests.post(url, data=json.dumps(myobj), headers=headers)
    jsonResponse = response.json()
    if jsonResponse["code"] == 200:
            return jsonResponse
    else:
        return False


def _GetEmployeeDetails(email):
    url = 'https://eservices.unra.go.ug/unramasterapi/employees/single?email='+email
    response = requests.get(url)
    jsonResponse = response.json()
    if jsonResponse["code"] == 200:
        return True, jsonResponse
    else:
        return False, []


def _Procurement():
    url = 'https://eservices.unra.go.ug/unramasterapi/employees/procurement'
    response = requests.get(url)
    jsonResponse = response.json()
    if jsonResponse["code"] == 200:
        return jsonResponse
    else:
        return False


def _allStaff():
    url = 'https://eservices.unra.go.ug/unramasterapi/employees/all'
    response = requests.get(url)
    jsonResponse = response.json()
    if jsonResponse["code"] == 200:
        return jsonResponse
    else:
        return False


def _SingleStaff():
    url = 'https://eservices.unra.go.ug/unramasterapi/employees/employees/all'
    #url = 'http://localhost:90/gen/api/v1.0/employees/single'
    response = requests.get(url)
    jsonResponse = response.json()
    if jsonResponse["code"] == 200:
        return jsonResponse
    else:
        return False
