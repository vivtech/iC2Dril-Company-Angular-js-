export interface Project {
    _id?: string;
    name: string;
    blockName?: string;
    fieldName?: string;
    fieldEnv?: number;
    wellName: string;
    state: string;
    depth: any;
    depthType: string;
    country: any;
    status: any;
    active: any;
}


export interface ProjectWell {
    manager?: any;
    _id?: string;
    fieldName?: string;
    rigLocation?: string;
    project?: any;
    status?: number;
    country?: any;
    data?: string;
    name: string;
    active?: number;
}

export interface ProjectCamera {
    _id?: string;
    company?: string;
    project?: any;
    well?: any;
    name: string;
    url?: string;
    username?: string;
    password?: string;
    data?: any;
    default?: number;
    confirm?: number;
    users?: any;
    active?: number;
}
