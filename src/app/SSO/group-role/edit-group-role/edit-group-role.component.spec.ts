import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupRoleComponent } from './edit-group-role.component';

describe('EditGroupRoleComponent', () => {
  let component: EditGroupRoleComponent;
  let fixture: ComponentFixture<EditGroupRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGroupRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGroupRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
