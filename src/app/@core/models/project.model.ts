export interface Project {
    _id?: string;
    name: string;
    users?: string;
    active?: number;
}


export interface ProjectWell {
    _id?: string;
    name: string;
    company?: string;
    project?: string;
    active?: number;
}

export interface ProjectCamera {
    _id?: string;
    company?: string;
    project?: string;
    well?: string;
    name: string;
    url?: string;
    username?: string;
    password?: string;
    users?: string;
    active?: number;
}
