import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradePackageComponent } from './upgrade-package.component';

describe('UpgradePackageComponent', () => {
  let component: UpgradePackageComponent;
  let fixture: ComponentFixture<UpgradePackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradePackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradePackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
