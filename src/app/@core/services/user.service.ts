import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Package } from '../models/package.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { UserType } from '../models/user-type.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    public dataList: BehaviorSubject < UserType[] > ;

    constructor(private http: HttpClient) {
        this.dataList = new BehaviorSubject < UserType[] > ([]);
    }

    create(fields): any {
        return this.http
            .post < any > (`${environment.apiUrl}/user`, fields)
            .pipe(
                map(response => {
                    return response;
                })
            );
    }

    getList(dataTablesParameters): any {
        return this.http
            .post < any > (
                `${environment.apiUrl}/user/list`,
                dataTablesParameters
            )
            .pipe(
                map(response => {
                    if (response.code === 200) {
                        console.log(response.data.data);
                        this.dataList.next(response.data.data);
                    }
                    return response;
                })
            );
    }

    getAllUser(): any {
        return this.http.get < any > (`${environment.apiUrl}/user/list`)
            .pipe(
                map(response => {
                    if (response.code === 200) {
                        console.log(response.data.data);
                        // this.dataList.next(response.data.data);
                    }
                    return response;
                })
            );
    }

    getUserByType(data): any {
        return this.http.get < any > (`${environment.apiUrl}/user/list?userType=${data}`)
            .pipe(
                map(response => {
                    if (response.code === 200) {
                        console.log(response.data.data);
                        // this.dataList.next(response.data.data);
                    }
                    return response;
                })
            );
    }

    checkEmailUser(data): any {
        console.log("data", data);
        return this.http.post < any > (`${environment.apiUrl}/emailcheck/`,
                data)
            .pipe(
                map(response => {
                    if (response.code === 200) {
                        console.log(response.data.data);
                        // this.dataList.next(response.data.data);
                    }
                    return response;
                })
            );
    }

    updateData(fieldParameters): any {
        return this.http
            .put < any > (`${environment.apiUrl}/user`, fieldParameters)
            .pipe(
                map(response => {
                    if (response.code === 200) {
                        console.log(response.data.data);
                    }
                    return response;
                })
            );
    }

    getData(id) {
        return this.http.get < any > (`${environment.apiUrl}/user/${id}`).pipe(
            map(response => {
                return response;
            })
        );
    }

    deleteData(id) {
        return this.http
            .delete < any > (`${environment.apiUrl}/user/${id}`)
            .pipe(
                map(response => {
                    return response;
                })
            );
    }

    getCompanyRequestList(): Observable < UserType[] > {
        return this.dataList.asObservable();
    }
}
