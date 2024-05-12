import { Department } from "./department";
import { Faculty } from "./faculty";

export class CreateStudent {
  identifier: string;
  name: string;
  email: string;
  address: string;
  gender: string;
  facultyId: number;
  password: string;
  avatar?: string;
  phone: string;
  batch: string;
  in_class: string;
}

export interface Student{
  id: number;
  identifier: string;
  name: string;
  email: string;
  address: string;
  gender: string;
  password: string;
  avatar?: string;
  phone: string;
  batch: string;
  in_class: string;
  faculty: Faculty;
}
