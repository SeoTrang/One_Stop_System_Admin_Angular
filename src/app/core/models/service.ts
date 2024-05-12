import { Department } from './department';
import { Document } from './document';

export class CreateService {
  constructor(
    public name: string,
    public type: string,
    public time_handle: string,
    public department_id: number,
    public description?: string
  ) {}
}

export class CreateFormFile {
  constructor(
    public link: string,
    public serviceId: number,
    public departmentId: number
  ) {}
}

export class CreateProceduralStep {
  constructor(
    public step: number,
    public department_id: number,
    public service_id: number
  ) {}
}

export class CreateAttribute {
  constructor(
    public name: string,
    public type: string,
    public service_id: number
  ) {}
}

export class CreateAttributeFormEnum {
  constructor(public name: string) {}
}

export interface AttributeFormEnum {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;

  attributeFormService?: AttributeFormService;
}

export interface AttributeValue {
  id: number;
  value: string;
  created_at: string;
  updated_at: string;
  document?: Document;
  attributeFormService?: AttributeFormService;
}

export interface AttributeFormService {
  id: number;

  name: string;

  // @IsIn(['text', 'select', 'checkBox', 'email', 'phoneNumber'])
  type: string;

  created_at: string;

  updated_at: string;

  service?: Service;

  attributeFormEnums?: AttributeFormEnum[];

  attributeValues?: AttributeValue[];
}

export interface Service {
  name: string;
  type: string;
  time_handle: string;
  description?: string;
  department?: Department;
  attributeFormServices?: AttributeFormService[];
  documents?: Document;
}
