import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Meeting } from '../models/meeting.model';


@Injectable({
    providedIn: 'root'
})

export class MeetingService {
    dataParam = {data: 'title'};
    public dataList: BehaviorSubject<Meeting[]>;
    constructor(private http: HttpClient) {
        this.dataList = new BehaviorSubject<Meeting[]>([]);
    }

    getList(dataTablesParameters): any {
        return this.http
            .post<any>(
                `${environment.apiUrl}/meeting/list`,
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

    getData(id) {
        return this.http.get<any>(`${environment.apiUrl}/meeting/${id}`).pipe(
            map(response => {
                return response;
            })
        );
    }

    getlicenceData() {
        return this.http.post<any>(`${environment.apiUrl}/package`, {}).pipe(
            map(response => {
                return response;
            })
        );
    }

    getMeetingUser(project, well) {
        return this.http.post<any>(`${environment.mobapiUrl}/meeting/users`, {project, well}).pipe(
            map(response => {
                return response;
            })
        );
    }

    getUtcOptions() {
        return this.http.get<any>(`${environment.mobapiUrl}/meeting/options`).pipe(
            map(response => {
                return response;
            })
        );
    }

    deleteData(id) {
        return this.http
            .delete<any>(`${environment.apiUrl}/meeting/${id}`)
            .pipe(
                map(response => {
                    return response;
                })
            );
    }

    updateStatus(fieldParameters): any {
        return this.http
            .put<any>(`${environment.apiUrl}/meeting/status`, fieldParameters)
            .pipe(
                map(response => {
                    if (response.code === 200) {
                        console.log(response.data.data);
                    }
                    return response;
                })
            );
    }

    create(fields): any {
        return this.http.post<any>(`${environment.mobapiUrl}/meeting`, fields)
            .pipe(map(response => {
                return response;
            }
            ));
    }

    updateData(fieldParameters): any {
        return this.http
            .put<any>(`${environment.mobapiUrl}/meeting`, fieldParameters)
            .pipe(
                map(response => {
                    if (response.code === 200) {
                        console.log(response.data.data);
                    }
                    return response;
                })
            );
    }
}
