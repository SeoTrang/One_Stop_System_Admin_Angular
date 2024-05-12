import { Student } from "./student";

export interface Faculty{
    id: number;
    name: string;
    user?: Student;
}