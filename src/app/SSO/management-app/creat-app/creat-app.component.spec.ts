import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatAppComponent } from './creat-app.component';

describe('CreatAppComponent', () => {
  let component: CreatAppComponent;
  let fixture: ComponentFixture<CreatAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
