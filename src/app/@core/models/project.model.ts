export interface Project {
    _id?: string;
    name: string;
    company?: string;
    project?: string;
    active?: number;
    address: string;
    city: string;
    state: string;
    country: string;
    client: any;
    status: any;
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
    users?: any;
    active?: number;
}
