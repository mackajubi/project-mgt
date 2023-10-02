import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiEndpointsService {

  // UNRA GEN ENDPOINTS.
  // getAllStaff = environment.unraGen + 'employees/all';  
  getAllStaff = environment.unraGen + 'employees/all-test';  
  // getStations = environment.unraGen + 'stations/all';  

  // Authentications
  login = environment.pythonApi + 'Auth/login';
  SSOLogin = environment.pythonApi + 'Auth/SSO';
  

  // WORKLOAD
  createWorkload = environment.pythonApi + 'Workload/CreateWorkload';
  uploadExcelsheet = environment.pythonApi + 'Workload/UploadExcel';
  
  // Dashboard
  dashboard = environment.pythonApi + 'Dashboard';

  // REFERENCE DATA
  // getDepartments = environment.unraGen + 'departments/all';  
  getDepartments = environment.pythonApi + 'Department';
  
  // PROJECTS
  projects = environment.pythonApi + 'Project';  
  
  // LAND ACQUISITION
  landAcquisition = environment.pythonApi + 'LandAcquisition';  
  
}
