import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidebarToggleService } from 'src/app/@core/utils/sidebar-toggle.service';

@Component({
  selector: 'app-web',
  templateUrl: './web.component.html',
  styleUrls: ['./web.component.css']
})
export class WebComponent implements OnInit, OnDestroy  {
    sidebarToggle: boolean = false;
    subscription: Subscription;

  constructor(private sidebarToggleService: SidebarToggleService ) { }

  ngOnInit() {
    this.subscription = this.sidebarToggleService.sidebarToggler.subscribe(
        (status) => {
          this.sidebarToggle = status;
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
