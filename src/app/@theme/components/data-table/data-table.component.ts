import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from 'src/app/@core/models/country.model';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {

    countries$: Observable<Country[]>;
    total$: Observable<number>;
    //@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor() { }

  ngOnInit() {
  }

}
