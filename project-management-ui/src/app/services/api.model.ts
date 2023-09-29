import { SafeUrl } from "@angular/platform-browser";
import { Permission, UserRole } from "../pages/workspace/workspace.model";

export interface Employee {
    UserId?: number;
    UserRole: UserRole[]; 
    FirstName: string;
    LastName: string;
    MiddleName?: string;
    FullName: string;
    Salutation?: string;
    WorkEmail: string; 
    userRole?: string;
    image?: SafeUrl;
    department?: string;
    section?: string;
    HCMPersonId?: number;
    EmployeeId?: string;
    WorkLocation?: string;
    StationId: number;
    Station: string;
    StationCode: string;
    DepartmentName?: string;
    HomePhoneNumber: string;
    DateOfBirth: Date;
    Gender: string;
    MaritalStatus: string;
    NationalId: string;
    HCMUserName: string;
    HireDate: Date;
    JobTitle: string;
    JobType: string;
    JobGradeCode: string;
    LineManager: string;
    Directorate: string;
    DirectorateCode: string;
    WorkLocationCode: string;
    StaffNo: string;
    Permissions?: string[];
    OnLeave: string;
    DelegatorUserId: number;
    Submitted: number;
}

export interface ApiPayload {
    code: number;
    message: string;
    data: any;
    jobs: any;
}

// export interface ConfirmYesNo {
//     reason?: string;
//     password?: string;
//     status: boolean;
// }
