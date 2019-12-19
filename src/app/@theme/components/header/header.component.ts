import { Component, OnInit, Input } from '@angular/core';
import { SidebarToggleService } from 'src/app/@core/utils/sidebar-toggle.service';
import { AuthenticationService } from 'src/app/@core/services/authentication.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    sidebarToggle = false;
    expiry;

    constructor(private sidebarToggleService: SidebarToggleService,
                private authService: AuthenticationService) { }

    ngOnInit() {
        this.authService.expiryData.subscribe(result => {
            this.expiry = result;
            console.log('PackageExpired', result);
        });
    }

    toggleSidebar(){
        this.sidebarToggle = !this.sidebarToggle;
        this.sidebarToggleService.setStatus(this.sidebarToggle);
    }


}
