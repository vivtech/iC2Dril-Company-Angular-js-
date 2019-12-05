import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CompanyRequest } from '../models/company-request.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompanyRequestService {
    public companyRequestList: BehaviorSubject<CompanyRequest[]>;

  constructor(private http: HttpClient) {
    this.companyRequestList = new BehaviorSubject<CompanyRequest[]>([]);
  }

    getCompanyRequests(dataTablesParameters): any{
        return this.http.post<any>(`${environment.apiUrl}/company-request/list`, dataTablesParameters)
                .pipe(map(response => {
                    if (response.code === 200) {
                        console.log(response.data.data);
                        this.companyRequestList.next(response.data.data);
                    }
                    return response;
              }));
    }

    updateCompanyRequest(fieldParameters): any{
        return this.http.put<any>(`${environment.apiUrl}/company-request`, fieldParameters)
                .pipe(map(response => {
                    if (response.code === 200) {
                        console.log(response.data.data);
                    }
                    return response;
              }));
    }

    createLicense(fieldParameters): any{
        return this.http.post<any>(`${environment.apiUrl}/company-request/create-license`, fieldParameters)
                .pipe(map(response => {
                    if (response.code === 200) {
                        console.log(response.data.data);
                    }
                    return response;
              }));
    }

    getCompanyRequest(id) {
        return this.http.get<any>(`${environment.apiUrl}/company-request/${id}` )
                .pipe(map(response => {

                    return response;
              }));
    }

    deleteCompanyRequest(id) {
        return this.http.delete<any>(`${environment.apiUrl}/company-request/${id}` )
                .pipe(map(response => {

                    return response;
              }));
    }

    getCompanyRequestList(): Observable<CompanyRequest[]> {
        return this.companyRequestList.asObservable();
    }

    getLatestNotify(): any {
        return this.http.get<any>(`${environment.apiUrl}/notification/list`, {}).pipe(map(response => {
            return response;
        }));
    }
}
