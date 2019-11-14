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
        link: '/dashboard'
    },
    {
        label: 'Projects',
        icon: 'fas fa-th-list',
        link: '/project'
    },
    {
        label: 'Rig Locations',
        icon: 'fas fa-map-marker-alt',
        link: '/riglocation/list'
    },
    {
        label: 'Cameras',
        icon: 'fas fa-video',
        link: '/camera/list',
    },
    {
        label: 'Meetings',
        icon: 'fas fa-handshake',
        link: '/meeting/list'
    },
    {
        label: 'Users',
        icon: 'fas fa-user',
        link: '/user/list'
    },
    {
        label: 'Upgrade',
        icon: 'fas fa-cubes',
        link: '/upgrade/package'
    },
    // {
    //     label: 'Upgrade',
    //     icon: 'fas fa-cubes',
    //     items: [
    //         {
    //             label: 'Package',
    //             icon: 'fas fa-user-plus',
    //             link: '/upgrade/package',
    //         },
    //         {
    //             label: 'User',
    //             icon: 'fas fa-user-plus',
    //             link: '/upgrade/adduser',
    //         }
    //     ]
    // },
    // {
    //     label: 'Notification',
    //     icon: 'fa fa-envelope',
    //     link: '/notification/list'
    // }
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
