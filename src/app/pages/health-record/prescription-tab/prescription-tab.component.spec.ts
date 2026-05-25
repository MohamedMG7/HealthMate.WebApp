import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionTabComponent } from './prescription-tab.component';

describe('PrescriptionTabComponent', () => {
  let component: PrescriptionTabComponent;
  let fixture: ComponentFixture<PrescriptionTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescriptionTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrescriptionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
