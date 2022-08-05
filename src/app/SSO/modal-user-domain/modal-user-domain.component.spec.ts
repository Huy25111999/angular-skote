import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserDomainComponent } from './modal-user-domain.component';

describe('ModalUserDomainComponent', () => {
  let component: ModalUserDomainComponent;
  let fixture: ComponentFixture<ModalUserDomainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalUserDomainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUserDomainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
