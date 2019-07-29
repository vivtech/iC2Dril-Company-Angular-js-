import { Component, OnInit, Input } from '@angular/core';
import { MenuItem } from 'src/app/@core/models/menu-item.model';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
    @Input() items : MenuItem[];
    constructor() { }

    ngOnInit() {
    }

}
