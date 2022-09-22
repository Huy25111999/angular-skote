import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectUserRoleComponent } from './connect-user-role.component';

describe('ConnectUserRoleComponent', () => {
  let component: ConnectUserRoleComponent;
  let fixture: ComponentFixture<ConnectUserRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectUserRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectUserRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
