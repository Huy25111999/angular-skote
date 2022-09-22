import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupRoleComponent } from './add-group-role.component';

describe('AddGroupRoleComponent', () => {
  let component: AddGroupRoleComponent;
  let fixture: ComponentFixture<AddGroupRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGroupRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGroupRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
