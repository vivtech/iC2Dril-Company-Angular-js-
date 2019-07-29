import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
    selector: 'app-notification-dropdown',
    templateUrl: './notification-dropdown.component.html',
    styleUrls: ['./notification-dropdown.component.css'],
    host: {
        '(document:click)': 'onClick($event)',
    },
})
export class NotificationDropdownComponent implements OnInit {
    visibility: boolean = false
    constructor(private _eref: ElementRef) { }

    ngOnInit() {
    }

    onClick(event) {
        if (!this._eref.nativeElement.contains(event.target) || this.visibility) {
            this.visibility = false
        } else {
            this.visibility = true
        }

    }

}
