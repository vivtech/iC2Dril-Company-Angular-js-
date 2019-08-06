import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
    appitems = [
        {
            label: 'Dashboard',
            icon: 'fas fa-home',
            link: '/dashboard',
          },
          {
            label: 'Create Project',
            icon: 'fas fa-th-list',
            link: '/project',
          },
        //   {
        //     label: 'Subscribed Company',
        //     icon: 'fas fa-th-list',
        //     link: '/company/list',
        //   },
        //   {
        //     label: 'Packages',
        //     icon: 'fas fa-th-list',
        //     link: '/package',
        //   },
        //   {
        //     label: 'Country',
        //     icon: 'fas fa-th-list',
        //     link: '/country',
        //   },

        // {
        //   label: 'Dashboard',
        //   icon: 'fas fa-home',
        //   items: [
        //     {
        //       label: 'Dashboard 1',
        //       link: '/item-1-1',
        //       icon: 'fab fa-accusoft'
        //     },
        //     {
        //       label: 'Dashboard 2',
        //       icon: 'fab fa-accessible-icon',
        //     }
        //   ]
        // },
        // {
        //   label: 'Item 2',
        //   icon: 'fas fa-th-list',

        // }
      ];
  constructor() { }

  ngOnInit() {
  }

}
