
export interface Project {
    ProjectID: number;
    ProjectNumber: string;
    ProjectName: string;
    RoadLength: string;
    SurfaceType: string;
    ProjectManager: string;
    ProjectEngineer: string;
    WorksSignatureDate: Date;
    CommencementDate: Date;
    WorksCompletionDate: Date;
    RevisedCompletionDate: Date;
    SupervisionSignatureDate: Date;
    SupervisionCompletionDate: Date;
    SupervisingConsultantContractAmount: number;
    RevisedSCContractAmount: number;
    SupervisingConsultant: string;
    SupervisionProcurementNumber: string;
    WorksContractAmount: number;
    RevisedWorksContractAmount: number;
    WorksContractor: string;
    WorksProcurementNumber: string;
    ProjectTypeID: number;
    ProjectType: string;
    ProjectFunderID: string;
    ProjectStatus: string;
    HasLandAcquisitionData: number;
}
export interface LandAcquisition {
    LandID: number;
    LandValued: string;
    LandAcquired: string;
    PAPsValued: string;
    PAPsPaid: string;
    AmountApproved: string;
    AmountPaid: string;
    KMsAcquired: string;
    ProjectID?: number;
}

export interface Workflow {
    Person: string;
    Comment: string;
    Date: Date;
    Status: string;
    Quantity?: number;
}

export interface UNRAGenEmployee {
    Salutation: string;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    FullName: string;
    EmployeeId: string;
    HomePhoneNumber: string;
    WorkEmail: string;
    DateOfBirth: string;
    Gender: string;
    HireDate: string;
    MaritalStatus: string;
    NationalId: string;
    HCMUserName: string;
    HCMPersonId: number;
    CreationDate: string;
    PersonId: number
}

export interface UserRole {
    RoleId: number;
    Role: string;
    Remarks?: string;
    Status?: string;
    CreatedBy?: string;
    CreateDate?: Date;
    UpdatedBy?: string;
    UpdateDate?: Date;  
}

export interface Permission {
    PermissionId: number;
    Permission: string;
    Remarks?: string;
    Status?: string;
    checked?: boolean;
    CreatedBy?: string;
    CreateDate?: Date;
    UpdatedBy?: string;
    UpdateDate?: Date;  
}

export interface RecordAction {
    access: string;
    granted: boolean;
}

export interface PieChartData {
    WeighStationName: string;
    WeighStation: string;
    data: ChartsData[];
    date: Date;
    StationName: string;
    TotalCleared: number
    TotalImpounded: number;
    TotalWeighed: number;
    WeighStationCode: string; 
    OverallTotal: number;
}

export interface ChartsData {
    label: string;
    count: number;
    color?: any;
}