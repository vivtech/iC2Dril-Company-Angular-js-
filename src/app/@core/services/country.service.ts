import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Package } from '../models/package.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Country } from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
    public dataList: BehaviorSubject<Country[]>;

    constructor(private http: HttpClient) {
        this.dataList = new BehaviorSubject<Country[]>([]);
      }

    create(fields): any {
        return this.http.post<any>(`${environment.apiUrl}/country`, fields)
            .pipe(map(response => {
                return response;
            }
        ));
    }


      getList(dataTablesParameters): any {
          return this.http.post<any>(`${environment.apiUrl}/country/list`, dataTablesParameters)
              .pipe(map(response => {
                  if (response.code === 200) {
                      console.log(response.data.data);
                      this.dataList.next(response.data.data);
                  }
                  return response;
              }
          ));
      }

      updateData(fieldParameters): any{
          return this.http.put<any>(`${environment.apiUrl}/country`, fieldParameters)
              .pipe(map(response => {
                  if (response.code === 200) {
                      console.log(response.data.data);
                  }
                  return response;
          }));
      }

      getData(id) {
          return this.http.get<any>(`${environment.apiUrl}/country/${id}` )
              .pipe(map(response => {

                  return response;
          }));
      }

      deleteData(id) {
          return this.http.delete<any>(`${environment.apiUrl}/country/${id}` )
              .pipe(map(response => {
                  return response;
          }));
      }

      getCompanyRequestList(): Observable<Country[]> {
          return this.dataList.asObservable();
      }
}
