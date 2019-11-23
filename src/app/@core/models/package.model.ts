export interface Package {
    _id?: string;
    name: string;
    user: number;
    active?: number;
}

export interface UpgradePackage {
    _id?: string;
    supcriptionType?: string;
    package?: string;
    userCount?: any;
    duration?: string;
    status?: number;
    active?: number;
}
