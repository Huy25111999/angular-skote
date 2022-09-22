import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementRoleComponent } from './management-role.component';

describe('ManagementRoleComponent', () => {
  let component: ManagementRoleComponent;
  let fixture: ComponentFixture<ManagementRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
