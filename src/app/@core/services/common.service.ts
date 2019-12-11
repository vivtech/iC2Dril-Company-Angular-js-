import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Country } from '../models/country.model';
import { Package } from '../models/package.model';
import { UserType } from '../models/user-type.model';
import { Currency } from '../models/currency.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
    public countryList: BehaviorSubject<Country[]>;
    public userTypeList: BehaviorSubject<UserType[]>;
    public packageList: BehaviorSubject<Package[]>;
    public currencyList: BehaviorSubject<Currency[]>;

  constructor(private http: HttpClient) {
    this.countryList = new BehaviorSubject<Country[]>([]);
    this.packageList = new BehaviorSubject<Package[]>([]);
    this.userTypeList = new BehaviorSubject<UserType[]>([]);
    this.currencyList = new BehaviorSubject<Currency[]>([]);
  }

  getRequestFormData() {
    console.log('enter');
    return this.http.get<any>(`${environment.adminUrl}/request-form-data`, {  })
        .pipe(map(response => {
            console.log(response);
            if (response.status === 'success') {
                console.log('packageList', response);
                this.countryList.next(response.data.country);
                this.packageList.next(response.data.package);
            }
            return response;
        }));
    }

    getCurrencyData() {
    return this.http.get<any>(`${environment.adminUrl}/currency-data?get=all`, {})
        .pipe(map(response => {
            console.log(response);
            if (response.status === 'success') {
                console.log(response);
                this.currencyList.next(response.data);
            }
            return response;
        }));
    }

    getUserTypeData() {
        // console.log("enter");
        return this.http.get<any>(`${environment.apiUrl}/user/type?get=all`, {})
            .pipe(map(response => {
                console.log(response);
                if (response.status === 'success') {
                    console.log(response);
                    this.userTypeList.next(response.data);
                }
                return response;
            }));
        }

    getDashboardData() {
        // console.log("enter");
        return this.http.get<any>(`${environment.apiUrl}/dashboard`, {})
        .pipe(map(response => {
            console.log(response);
            return response;
        }));
    }

    getCountryList(): Observable<Country[]> {
        return this.countryList.asObservable();
    }
    getUserTypeList(): Observable<UserType[]> {
        return this.userTypeList.asObservable();
    }
    getPackageList(): Observable<Package[]> {
        return this.packageList.asObservable();
    }
    getCurrencyList(): Observable<Currency[]> {
        return this.currencyList.asObservable();
    }

    submitRequestForm(fields: any) {
        return this.http.post<any>(`${environment.apiUrl}/request-form`, fields)
        .pipe(map(response => {
            console.log(response);
            return response;
        }));
    }
}
