import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Package } from '../models/package.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Country } from '../models/country.model';
import { ProjectWell, ProjectCamera } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectCameraService {
    public dataList: BehaviorSubject<ProjectCamera[]>;

    constructor(private http: HttpClient) {
        this.dataList = new BehaviorSubject<ProjectCamera[]>([]);
      }

    create(fields): any {
        return this.http.post<any>(`${environment.apiUrl}/camera`, fields)
            .pipe(map(response => {
                return response;
            }
        ));
    }


      getList(dataTablesParameters): any {
          return this.http.post<any>(`${environment.apiUrl}/camera/list`, dataTablesParameters)
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
          return this.http.put<any>(`${environment.apiUrl}/camera`, fieldParameters)
              .pipe(map(response => {
                  if (response.code === 200) {
                      console.log(response.data.data);
                  }
                  return response;
          }));
      }

      getData(id) {
          return this.http.get<any>(`${environment.apiUrl}/camera/${id}` )
              .pipe(map(response => {

                  return response;
          }));
      }

      deleteData(id) {
          return this.http.delete<any>(`${environment.apiUrl}/camera/${id}` )
              .pipe(map(response => {
                  return response;
          }));
      }

      getCompanyRequestList(): Observable<ProjectCamera[]> {
          return this.dataList.asObservable();
      }

      checkCamera(id) {
        return true;
        return this.http.get<any>(`${environment.apiUrl}/camera/${id}`)
            .pipe(map(response => {
                console.log("response", response);
                if(response.status === 200){
                    return true;
                }
                return false;
            }));
      }
}
