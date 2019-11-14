import { Component, OnInit } from '@angular/core';
import { MeetingService } from 'src/app/@core/services/meeting.service';

@Component({
  selector: 'app-upgrade-package',
  templateUrl: './upgrade-package.component.html',
  styleUrls: ['./upgrade-package.component.css']
})
export class UpgradePackageComponent implements OnInit {
    title = 'Upgrade';
    passwordVisible = false;
  constructor(private meetService: MeetingService) { }

  ngOnInit() {
    this.meetService.getlicenceData().subscribe(response => {
        console.log('license-history', response);
    });
  }

    togglePassword() {
        // this.submitted = false;
        this.passwordVisible = !this.passwordVisible;
    }

}
