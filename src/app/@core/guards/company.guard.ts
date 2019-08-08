import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { CompanyService } from '../services/company.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompanyGuard implements  CanActivate {

    constructor(private router: Router, private companyService: CompanyService){

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {
        const token = route.paramMap.get('data');
        console.log(token);
        return this.companyService.checkCompany(token);

    }
}
