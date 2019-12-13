import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { CompanyRequestService } from 'src/app/@core/services/company-request.service';
import { Router } from '@angular/router';
import { timer, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, catchError } from 'rxjs/operators';

@Component({
    selector: 'app-notification-dropdown',
    templateUrl: './notification-dropdown.component.html',
    styleUrls: ['./notification-dropdown.component.css'],
    // tslint:disable-next-line: no-host-metadata-property
    host: {
        '(document:click)': 'onClick($event)',
    },
})
export class NotificationDropdownComponent implements OnInit, OnDestroy {
    visibility = false;
    notification = [];
    notificationCount: number;
    private fetchData: Observable<any> =  this.notService.getNotificationWithCount();
    private killTrigger: Subject<void> = new Subject();
    private refreshInterval: Observable<any> = timer(0, 30000)
    .pipe(
    // This kills the request if the user closes the component
    takeUntil(this.killTrigger),
    // switchMap cancels the last request, if no response have been received since last tick
    switchMap(() => this.fetchData)
    );

    constructor(private eref: ElementRef,
                private notService: CompanyRequestService,
                private route: Router) { }

    ngOnInit() {
        this.refreshInterval.subscribe(notificationlist => {
            console.log('response', notificationlist);
            const result = notificationlist.data;
            this.notificationCount = (result.count <= 99) ? result.count : `99+`;
            this.notification = result.notifications;
        });
    }

    onClick(event) {
        if (!this.eref.nativeElement.contains(event.target) || this.visibility) {
            this.visibility = false;
        } else {
            this.visibility = true;
        }
    }

    // getNotification() {
    //     this.notService.getNotificationWithCount().subscribe(notificationlist => {
    //         console.log('result', notificationlist);
    //         const result = notificationlist.data;
    //         this.notificationCount = (result.count <= 99) ? result.count : `99+`;
    //         this.notification = result.notifications;
    //     });
    // }

    redirectTo(id) {
        const status = { data: id };
        const promise = new Promise((resolve) => {
            this.notService.UpdateNotifiStatus(status).subscribe(response => {
                resolve(response);
            });
        });
        promise.then(this.notService.getNotificationWithCount().subscribe(notificationlist => {
            console.log('response', notificationlist);
            const result = notificationlist.data;
            this.notificationCount = (result.count <= 99) ? result.count : `99+`;
            this.notification = result.notifications;
        }));
        this.route.navigateByUrl('/meeting/list');
    }

    ngOnDestroy() {
        this.killTrigger.next();
    }
}
