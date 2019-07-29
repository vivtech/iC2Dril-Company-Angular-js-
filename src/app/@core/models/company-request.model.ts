import { Country } from './country.model';
import { Package } from './package.model';

export interface CompanyRequest {
    _id?: string;
    name: string;
    companyName: string;
    country: Country;
    email: string;
    phone: string;
    package: Package;
    createdAt: Date;
    userCount: number;
    status: number;
    notes: string;
    active?: string;
}
