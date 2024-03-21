import { Department } from "./department.interface";

export interface Service{
    id: number;
    name: string;
    type: string;
    department: Department;
    used: string;
    time_handle: string;
    description: string;
    created_at: string;
    updated_at: string;
}