import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Package } from '../models/package.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PackageService {  public packageList: BehaviorSubject<Package[]>;

    constructor(private http: HttpClient) {
      this.packageList = new BehaviorSubject<Package[]>([]);
    }

    create(fields): any {
        return this.http.post<any>(`${environment.apiUrl}/package/request`, fields)
            .pipe(map(response => {
                return response;
            }
        ));
    }

    getPackages(dataTablesParameters): any {
        return this.http.post<any>(`${environment.apiUrl}/package`, dataTablesParameters)
            .pipe(map(response => {
                if (response.code === 200) {
                    console.log(response.data.data);
                    this.packageList.next(response.data.data);
                }
                return response;
            }
        ));
    }

    updatePackage(fieldParameters): any{
        return this.http.put<any>(`${environment.apiUrl}/package`, fieldParameters)
            .pipe(map(response => {
                if (response.code === 200) {
                    console.log(response.data.data);
                }
                return response;
        }));
    }

    getPackage(id) {
        return this.http.get<any>(`${environment.apiUrl}/package/${id}` )
            .pipe(map(response => {

                return response;
        }));
    }

    deletePackage(id) {
        return this.http.delete<any>(`${environment.apiUrl}/package/${id}` )
            .pipe(map(response => {
                return response;
        }));
    }

    getCompanyRequestList(): Observable<Package[]> {
        return this.packageList.asObservable();
    }
}
