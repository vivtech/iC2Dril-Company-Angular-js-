import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Company } from '../models/company.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {
    public companyList: BehaviorSubject<Company[]>;

    constructor(private http: HttpClient) {
        this.companyList = new BehaviorSubject<Company[]>([]);
    }

    createData(fields): any {
        return this.http.post<any>(`${environment.apiUrl}/company`, fields)
            .pipe(map(response => {
                if (response.code === 200) {
                    console.log(response.data.data);
                }
                return response;
            }));
    }

    getList(dataTablesParameters): any {
        return this.http.post<any>(`${environment.apiUrl}/company/list`, dataTablesParameters)
            .pipe(map(response => {
                if (response.code === 200) {
                    console.log(response.data.data);
                    this.companyList.next(response.data.data);
                }
                return response;
            }));
    }

    updateData(fieldParameters): any {
        return this.http.put<any>(`${environment.apiUrl}/company`, fieldParameters)
            .pipe(map(response => {
                if (response.code === 200) {
                    console.log(response.data.data);
                }
                return response;
            }));
    }

    getData(id) {
        return this.http.get<any>(`${environment.apiUrl}/company/${id}`)
            .pipe(map(response => {

                return response;
            }));
    }

    checkCompany(id) {
        return true;
        return this.http.get<any>(`${environment.apiUrl}/company/${id}`)
            .pipe(map(response => {
                console.log("response", response);
                if(response.status === 200){
                    return true;
                }
                return false;
            }));
    }

    deleteData(id) {
        return this.http.delete<any>(`${environment.apiUrl}/company/${id}`)
            .pipe(map(response => {

                return response;
            }));
    }

    getCompanyList(): Observable<Company[]> {
        return this.companyList.asObservable();
    }

    licenseHistory(company, dataTablesParameters): any {
        return this.http.post<any>(`${environment.apiUrl}/company/license-history/${company}`, dataTablesParameters)
            .pipe(map(response => {
                if (response.code === 200) {
                    console.log(response.data.data);
                }
                return response;
            }));
    }
}
