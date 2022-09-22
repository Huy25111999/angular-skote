import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditByRoleComponent } from './edit-by-role.component';

describe('EditByRoleComponent', () => {
  let component: EditByRoleComponent;
  let fixture: ComponentFixture<EditByRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditByRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditByRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
