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
	dataParam = {data:'title'};

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

    getCompanyRequestList(): Observable<Meeting[]> {
        return this.dataList.asObservable();
    }

    create(fields): any {
        return this.http
            .post<any>(`${environment.apiUrl}/user`, fields)
            .pipe(
                map(response => {
                    return response;
                })
            );
    }
}