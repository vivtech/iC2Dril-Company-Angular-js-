import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/@core/services/common.service';
import { Dashboard } from 'src/app/@core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboard: Dashboard;
  constructor(private route: ActivatedRoute,
              private service: CommonService) { }

  ngOnInit() {
      this.service.getDashboardData().subscribe(dashboardData => {
          // tslint:disable-next-line: no-unused-expression
          dashboardData.data.userCount = dashboardData.data.userCount - 1;
          console.log('dashboardData', dashboardData);
          this.dashboard = dashboardData.data;
      });
      const anyType: any = 'any type';
      console.log('stringType',  anyType.toUpperCase());
  }

}
