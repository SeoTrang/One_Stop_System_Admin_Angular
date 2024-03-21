export interface RBAC{
    id: number;
    label: string;
    subRBAC: RBAC[];
    checked: boolean;
    parent_id: number;

}