import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SidebarToggleService {
    public sidebarToggler = new Subject<boolean>();

    constructor() { }

    setStatus(status: boolean) {
        this.sidebarToggler.next(status); //it is publishing this value to all the subscribers that have already subscribed to this message
      }
}
