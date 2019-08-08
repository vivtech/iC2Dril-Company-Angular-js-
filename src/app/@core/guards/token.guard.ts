import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { ProjectWellService } from '../services/project-well.service';
import { ProjectCameraService } from '../services/project-camera.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenGuard implements  CanActivate {

    constructor(private router: Router, private wellService: ProjectWellService, private cameraService: ProjectCameraService){

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {
        const token = route.paramMap.get('data');
        const guard = route.data;
        switch(guard.guard) {
        	case "project": 
        	console.log('project', guard.guard)
        	   return this.wellService.checkWell(token);
        	   break;
    	   case "well": 
    	   console.log('well', guard.guard)
	    	   return this.cameraService.checkCamera(token);
	    	   break;
        }
        console.log(token);
    }
}
