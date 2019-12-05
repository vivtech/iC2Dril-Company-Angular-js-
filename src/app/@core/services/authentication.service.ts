import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private currentUserSubject: BehaviorSubject<User>;
    private currentUserToken: BehaviorSubject<string>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient,
                private router: Router) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('companyUser')));
        this.currentUserToken = new BehaviorSubject<string>(localStorage.getItem('companyToken'));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public get userToken(): string {
        return this.currentUserToken.value;
    }

    login(email: string, password: string) {

        return this.http.post<any>(`${environment.apiUrl}/login`, { email, password, device_type: 'ios' })
            .pipe(map(response => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                if ( response.status === 'success' ) {
                    // console.log('loginRES', response.data)
                    localStorage.setItem('companyUser', JSON.stringify(response.data.user));
                    localStorage.setItem('companyToken', response.data.token);
                    localStorage.setItem('companyId', response.data.user.company);
                    this.currentUserSubject.next(response.data.user);
                    console.log(response.data.token);
                    this.currentUserToken.next(response.data.token);
                }

                return response;
            }));
    }

    profileUpdate(profileUpdate) {

        return this.http.put<any>(`${environment.apiUrl}/profile`, profileUpdate)
            .pipe(map(response => {
                console.log(response.data);
                const result = response.data;
                if ( response.status === 'success' ) {
                    localStorage.setItem('companyUser', JSON.stringify(response.data.user));
                    this.currentUserSubject.next(response.data.user);
                    setTimeout(() => {
                        // tslint:disable-next-line: triple-equals
                        if (result.oldemail != result.user.email) {
                            console.log('Email not same');
                            this.logout();
                            this.router.navigate(['/login']);
                        }
                    }, 500);
                }

                return response;
            }));
    }

    getSubscriptions(companyId) {
        return this.http.get<any>(`${environment.apiUrl}/packagedetails`)
        .pipe(map(response => {
            if (response.code === 200) {
                console.log(response.data.data);
            }
            return response;
        }));
    }

    changePassword(passwordField) {

        return this.http.put<any>(`${environment.apiUrl}/change-password`, passwordField)
            .pipe(map(response => {
                return response;
            }));
    }

    forgotPasword(email: string) {

        return this.http.post<any>(`${environment.apiUrl}/forgot-password`, { email })
            .pipe(map(response => {
                console.log(response)
                return response;
            }));
    }

    resetPasword(dataValues) {
        return this.http.post<any>(`${environment.apiUrl}/reset-password`, dataValues)
            .pipe(map(response => {
                console.log(response);
                return response;
            }));
    }

    checkResetToken(token: string) {
        return true;
        return this.http.post<any>(`${environment.apiUrl}/check-reset-token`, { token })
            .pipe(map(response => {
                if (response.status === 'success') {
                    return true;
                }
                return false;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('companyUser');
        localStorage.removeItem('companyToken');
        this.currentUserSubject.next(null);
        this.currentUserToken.next(null);
    }
}
