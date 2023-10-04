import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntDesignComponent } from './ant-design.component';

describe('AntDesignComponent', () => {
  let component: AntDesignComponent;
  let fixture: ComponentFixture<AntDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AntDesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AntDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
