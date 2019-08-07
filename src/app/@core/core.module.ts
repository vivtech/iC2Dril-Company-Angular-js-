import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './utils/jwt.interceptor';
import { ErrorInterceptor } from './utils/error.interceptor';
import { FormService } from './services/form-validation.service';
import { CommonService } from './services/common.service';
import { ResetTokenGuard } from './guards/rest-token-checker.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { ProjectService } from './services/project-service';
import { ProjectService } from './services/project.service';
import { UserService } from './services/user.service';
import { ProjectWellService } from './services/project-well.service';

const COMMON_INTERCEPTOR = [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
];

const SERVICES = [
    UserService,
    ProjectService,
    ProjectWellService,
];

const COMMON_SERVICES = [
    FormService,
    CommonService,
];
const COMMON_GUARDS = [
    ResetTokenGuard
    // {
    //     provide: 'resetTokenGuard',
    //     useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => true
    //   }
];



@NgModule({
    declarations: [],
    imports: [
        CommonModule
    ],
    providers: [
        ...COMMON_INTERCEPTOR,
        ...COMMON_SERVICES,
        ...COMMON_GUARDS,
        ...SERVICES
    ]
})
export class CoreModule { }
