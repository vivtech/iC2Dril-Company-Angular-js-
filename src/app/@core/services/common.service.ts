import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Country } from '../models/country.model';
import { Package } from '../models/package.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
    public countryList: BehaviorSubject<Country[]>;
    public packageList: BehaviorSubject<Package[]>;

  constructor(private http: HttpClient) {
    this.countryList = new BehaviorSubject<Country[]>([]);
    this.packageList = new BehaviorSubject<Package[]>([]);
  }

  getRequestFormData() {
    console.log("enter");
    return this.http.get<any>(`${environment.apiUrl}/request-form-data`, {  })
        .pipe(map(response => {
            console.log(response);
            if (response.status === 'success') {
                console.log(response);
                this.countryList.next(response.data.country);
                this.packageList.next(response.data.package);
            }
            return response;
        }));
    }
    getCountryList(): Observable<Country[]> {
        return this.countryList.asObservable();
    }
    getPackageList(): Observable<Package[]> {
        return this.packageList.asObservable();
    }

    submitRequestForm(fields: any){
        return this.http.post<any>(`${environment.apiUrl}/request-form`, fields)
        .pipe(map(response => {
            console.log(response);
            return response;
        }));
    }
}
