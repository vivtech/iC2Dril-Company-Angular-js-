import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Package } from '../models/package.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Country } from '../models/country.model';
import { ProjectWell } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectWellService {
    public dataList: BehaviorSubject<ProjectWell[]>;

    constructor(private http: HttpClient) {
        this.dataList = new BehaviorSubject<ProjectWell[]>([]);
      }

    create(fields): any {
        return this.http.post<any>(`${environment.apiUrl}/well`, fields)
            .pipe(map(response => {
                return response;
            }
        ));
    }

    getAll(id): any {
        return this.http.post(`${environment.apiUrl}/well/list?type=All`, {project: id})
            .pipe(map(response => {
                return response;
            }
        ));
    }


      getList(dataTablesParameters): any {
          return this.http.post<any>(`${environment.apiUrl}/well/list`, dataTablesParameters)
              .pipe(map(response => {
                  if (response.code === 200) {
                      console.log(response.data.data);
                      this.dataList.next(response.data.data);
                  }
                  return response;
              }
          ));
      }

        getListById(dataTablesParameters, id): any {
            return this.http.get<any>(`${environment.apiUrl}/well/${id}`, dataTablesParameters)
                .pipe(map(response => {

                    return response;
                }));
        }

      updateData(fieldParameters): any{
          return this.http.put<any>(`${environment.apiUrl}/well`, fieldParameters)
              .pipe(map(response => {
                  if (response.code === 200) {
                      console.log(response.data.data);
                  }
                  return response;
          }));
      }

      getData(id) {
          return this.http.get<any>(`${environment.apiUrl}/well/${id}` )
              .pipe(map(response => {

                  return response;
          }));
      }

      deleteData(id) {
          return this.http.delete<any>(`${environment.apiUrl}/well/${id}` )
              .pipe(map(response => {
                  return response;
          }));
      }

      getCompanyRequestList(): Observable<ProjectWell[]> {
          return this.dataList.asObservable();
      }

      checkWell(id) {
        return true;
        return this.http.get<any>(`${environment.apiUrl}/well/${id}`)
            .pipe(map(response => {
                console.log("response", response);
                if(response.status === 200){
                    return true;
                }
                return false;
            }));
      }
}
