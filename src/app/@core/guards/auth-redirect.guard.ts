import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthRedirect implements CanActivate {
    constructor(private router: Router, private authenticationService: AuthenticationService) {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.userToken;
        console.log(currentUser);
        if (currentUser) {
            this.router.navigate(
                ['/dashboard']
                , { queryParams: { returnUrl: state.url } }
                );
            return false;
        }
        return true;
    }
}
