import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementGroupRoleComponent } from './management-group-role.component';

describe('ManagementGroupRoleComponent', () => {
  let component: ManagementGroupRoleComponent;
  let fixture: ComponentFixture<ManagementGroupRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementGroupRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementGroupRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
