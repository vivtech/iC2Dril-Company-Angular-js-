import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ResetTokenGuard implements  CanActivate {

    constructor(private router: Router, private authenticationService: AuthenticationService){

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const token = route.paramMap.get('token');
        console.log(token);
        const response = this.authenticationService.checkResetToken(token);
        if (!response) {
            this.router.navigate(['/login']);
        }
        return response;
    }
}
