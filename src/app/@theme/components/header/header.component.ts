import { Component, OnInit, Input } from '@angular/core';
import { SidebarToggleService } from 'src/app/@core/utils/sidebar-toggle.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    sidebarToggle: boolean = false;


    constructor(private sidebarToggleService: SidebarToggleService) { }

    ngOnInit() {

    }

    toggleSidebar(){
        this.sidebarToggle = !this.sidebarToggle
        this.sidebarToggleService.setStatus(this.sidebarToggle);
    }


}
