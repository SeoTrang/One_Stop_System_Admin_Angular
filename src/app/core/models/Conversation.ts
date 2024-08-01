import { Officer } from "@modules/admin/admin_f/officer/interface/officer.interface";
import { Department } from "./department";
import { Student } from "./student";

export interface QuestionMediaContents{
    id: number;
    url: string;
    type: string;
}

export interface Question{
    id?: number;
    content: string;
    type_user: string;
    user_id: number;
    type_question: string;
    created_at: Date;
    updated_at: Date;
    questionMediaContents?: QuestionMediaContents[];
    user?: Student | Officer;
    questionSeen?: QuestionSeen[];
}

export interface QuestionSeen{
    id: number;
    type_user: string;
    user_id: number;
    question?: Question;
}

export interface Conversation{
    id: number;
    user: Student;
    department: Department;
    latestQuestions: Question;
}