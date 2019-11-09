import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upgrade-package',
  templateUrl: './upgrade-package.component.html',
  styleUrls: ['./upgrade-package.component.css']
})
export class UpgradePackageComponent implements OnInit {
    title = 'Upgrade package';
    passwordVisible = false;
  constructor() { }

  ngOnInit() {
  }

    togglePassword() {
        // this.submitted = false;
        this.passwordVisible = !this.passwordVisible;
    }

}
