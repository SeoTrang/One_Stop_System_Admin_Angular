export interface CreateDepartment{
    name: string;
    address: string;
}

export interface UpdateDepartment{
    name: string;
    address: string;
}

export interface DepartmentDetail{
    name: string;
    address: string;
    officers: number;
    documents: number;
    services: number;
    created_at: string;
    updated_at: string;
}

export interface Department{
    name: string;
    address: string;
    created_at: string;
    updated_at: string;
}
