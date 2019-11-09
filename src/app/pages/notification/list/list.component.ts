import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
    @ViewChild(DataTableDirective, { static: false })
    datatableElement: DataTableDirective;
    title = 'Notification';
    dtOptions: DataTables.Settings = {};
    constructor() { }

    ngOnInit() {
    }

    refreshTable() {
        this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
        });
    }

}
