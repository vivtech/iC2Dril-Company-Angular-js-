import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Package } from '../models/package.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {  public packageList: BehaviorSubject<Package[]>;

    constructor(private http: HttpClient) {
      this.packageList = new BehaviorSubject<Package[]>([]);
    }

    getUserType(): any {
        return this.http.get<any>(`${environment.apiUrl}/user/type`)
            .pipe(map(response => {
                if (response.code === 200) {
                    console.log(response.data.data);
                    this.packageList.next(response.data.data);
                }
                return response;
            }
        ));
    }
}
