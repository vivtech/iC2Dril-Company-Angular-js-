export interface Package {
    _id?: string;
    name: string;
    user: number;
    active?: number;
}

export interface UpgradePackage {
    _id?: string;
    subscriptionType?: string;
    package?: any;
    userCount?: any;
    duration?: string;
    status?: number;
    active?: number;
}

export interface Expiry {
    expiry?: any;
}
