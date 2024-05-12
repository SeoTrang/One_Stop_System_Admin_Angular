import { Department } from "./department.interface";
import { Role } from "./role.interface";

export interface Officer{
    id: number;
    identifier: string;
    avatar: string;
    name: string;
    email: string;
    phone: string;
    department: Department;
    isAdmin: boolean;
    created_at: string;
    updated_at: string;
    roles?: Role[];
}