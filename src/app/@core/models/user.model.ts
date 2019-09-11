import { Country } from './country.model';

export class User {
    _id?: number;
    name: string;
    email?: string;
    phone?: string;
    tel?: Country;
    active?: string;
    designation?: string;
    userType?: string;
    blocked?: string;
}
