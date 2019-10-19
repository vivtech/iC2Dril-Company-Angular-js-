import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Package } from '../models/package.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Country } from '../models/country.model';
import { Project } from '../models/project.model';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    public dataList: BehaviorSubject<Project[]>;

    constructor(private http: HttpClient) {
        this.dataList = new BehaviorSubject<Project[]>([]);
    }

    create(fields): any {
        return this.http.post<any>(`${environment.apiUrl}/project`, fields)
            .pipe(map(response => {
                return response;
            }
            ));
    }


    getList(dataTablesParameters): any {
        return this.http.post<any>(`${environment.apiUrl}/project/list`, dataTablesParameters)
            .pipe(map(response => {
                if (response.code === 200) {
                    console.log(response.data.data);
                    this.dataList.next(response.data.data);
                }
                return response;
            }
            ));
    }

    getAll(): any {
        return this.http.post(`${environment.apiUrl}/project/list?type=All`, {})
            .pipe(map(response => {
                return response;
            }
        ));
    }

    updateData(fieldParameters): any {
        return this.http.put<any>(`${environment.apiUrl}/project`, fieldParameters)
            .pipe(map(response => {
                if (response.code === 200) {
                    console.log(response.data.data);
                }
                return response;
            }));
    }

    getData(id) {
        return this.http.get<any>(`${environment.apiUrl}/project/${id}`)
            .pipe(map(response => {

                return response;
            }));
    }

    deleteData(id) {
        return this.http.delete<any>(`${environment.apiUrl}/project/${id}`)
            .pipe(map(response => {
                return response;
            }));
    }

    // getCompanyRequestList(): Observable<Project[]> {
    //     return this.dataList.asObservable();
    // }
}
