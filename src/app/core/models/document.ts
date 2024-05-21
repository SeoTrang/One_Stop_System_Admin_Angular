import { Department } from "./department";
import { AttributeValue, Service } from "./service";
import { Student } from "./student";

export class UpdateDocumentDto{
    confirm: string;
    description?: string;
    service_id: number;
    constructor(
        confirm: string,
        service_id: number,
        description?: string,
    )
    {
        this.confirm = confirm;
        this.description = description;
        this.service_id = service_id;
    }
}

export interface Document{
   
    id: number;

    
    status: number; //1.pending 2.success 0.cancled

    
    description: string;

    
    address: string;

    
    type_user: string;

    user_id: number; 
   
    created_at: string;

    
    updated_at: string;

    
    department?: Department;

    
    service?: Service;

   
    // proceduralStep?: ProceduralStep;

    
    attributeValues?: AttributeValue[];


   
    // documentActivityTraces?: DocumentActivityTrace[];
}