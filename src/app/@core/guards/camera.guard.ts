import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { ProjectCameraService } from '../services/project-camera.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CameraGuard implements  CanActivate {

    constructor(private router: Router, private cameraService: ProjectCameraService){

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {
        const token = route.paramMap.get('data');
        console.log(token);
        return this.cameraService.checkCamera(token);

    }
}
