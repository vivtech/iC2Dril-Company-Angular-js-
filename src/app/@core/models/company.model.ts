export interface Company {
    _id?: string;
    customerId?: string;
    name: string;
    contactName?: string;
    email?: string;
    phone?: string;
    userCount?: number;
    expireAt?: Date;
    notes?: string;
    country?: any;
    package?: any;
    active?: number;
}
