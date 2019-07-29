export interface LicenseHistory {
    _id?: string;
    company?: string;
    packageName?: string;
    oldCount?: number;
    newCount?: number;
    expireAt?: Date;
    active?: number;
}
