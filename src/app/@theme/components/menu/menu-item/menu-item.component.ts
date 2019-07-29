import { Component, OnInit, Input, SimpleChanges, ElementRef } from '@angular/core';
import { MenuItem } from 'src/app/@core/models/menu-item.model';

@Component({
    selector: 'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.css'],
    host: {
        '(document:click)': 'onClick($event)',
    },
})
export class MenuItemComponent implements OnInit {
    @Input() item: MenuItem;
    toggleState: boolean = false

    constructor(private _eref: ElementRef) { }

    ngOnInit() {
    }


    hasSubmenu() {
        return this.item.items && this.item.items.length > 0 ? true : false;
    }

    onClick(event) {
        if (!this._eref.nativeElement.contains(event.target) || this.toggleState) {
            this.toggleState = false
        } else {
            this.toggleState = true
        }

    }

}
