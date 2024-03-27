export class ContentPost{
    content: string;
    type: string;
}

export class CreatePost {
    constructor (
        private caption: string,
        private title?: string,
        private department_id?: number,
        private content?: ContentPost[]

    ){}
}

interface Reaction{
    id: number;
    user_id: number;
    type_user: string;
    created_at: string;
    updated_at: string;
}

interface User{
    id: number;
    identifier: string;
    name: string;
    password: string;
    batch: string;
    email: string;
    phone: string;
    in_class: string;
    address: string;
    gender: string;
    avatar: string;
    created_at: string;
    updated_at: string;
}

interface Officer{
    id: number;
    identifier: string;
    name: string;
    password: string;
    batch: string;
    email: string;
    phone: string;
    isAdmin: boolean;
    address: string;
    gender: string;
    avatar: string;
    created_at: string;
    updated_at: string;
}

interface Comment{
    id: number;
    parent_id: number;
    content: string;
    media_content: string;
    user_id: number;
    type_user: string;
    created_at: string;
    updated_at: string;
    children: Comment[];
    user?: User;
    officer?: Officer;
}

export interface Post{
    id: number;
    title: string;
    caption: string;
    user_id: number;
    type_user: string;
    created_at: string;
    updated_at: string;
    reactions: Reaction[];
    comments: Comment[];
    user?: User;
    officer?: Officer;
}