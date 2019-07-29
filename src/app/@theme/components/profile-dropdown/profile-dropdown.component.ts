import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthenticationService } from 'src/app/@core/services/authentication.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile-dropdown',
    templateUrl: './profile-dropdown.component.html',
    styleUrls: ['./profile-dropdown.component.css'],
    host: {
        '(document:click)': 'onClick($event)',
    },
})
export class ProfileDropdownComponent implements OnInit {
    visibility = false;
    redirectUrl = '/login';
    user: any;

    constructor(private _eref: ElementRef, private router: Router, private authenticationService: AuthenticationService) { }

    ngOnInit() {
        this.authenticationService.currentUser.subscribe(data => {
            this.user = data;
        });
    }

    onClick(event) {
        if (!this._eref.nativeElement.contains(event.target) || this.visibility) {
            this.visibility = false;
        } else {
            this.visibility = true;
        }

    }

    gotoProfile() {
        this.router.navigate(['/profile']);
    }

    logout() {
        this.authenticationService.logout();
        console.log('on');
        this.router.navigate([this.redirectUrl]);
        console.log('off');
    }

}
