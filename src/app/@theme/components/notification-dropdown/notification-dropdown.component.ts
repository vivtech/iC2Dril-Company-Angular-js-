import { Component, OnInit, ElementRef } from '@angular/core';
import { CompanyRequestService } from 'src/app/@core/services/company-request.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-notification-dropdown',
    templateUrl: './notification-dropdown.component.html',
    styleUrls: ['./notification-dropdown.component.css'],
    // tslint:disable-next-line: no-host-metadata-property
    host: {
        '(document:click)': 'onClick($event)',
    },
})
export class NotificationDropdownComponent implements OnInit {
    visibility = false;
    notification = [];
    notificationCount: number;
    constructor(private eref: ElementRef,
                private notService: CompanyRequestService,
                private route: Router) { }

    ngOnInit() {
        this.getNotification();
    }

    onClick(event) {
        if (!this.eref.nativeElement.contains(event.target) || this.visibility) {
            this.visibility = false;
        } else {
            this.visibility = true;
        }
    }

    getNotification() {
        this.notService.getLatestNotifyCount().subscribe(count => {
            this.notificationCount = count.data.count;
            console.log('count', count);
        });
        this.notService.getLatestNotify().subscribe(notificationlist => {
            this.notification = notificationlist.data;
            console.log('result', this.notification);
        });
    }

    redirectTo() {
        this.route.navigateByUrl('/meeting/list');
    }
}
