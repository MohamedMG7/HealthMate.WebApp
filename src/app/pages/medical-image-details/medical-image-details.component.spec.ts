import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalImageDetailsComponent } from './medical-image-details.component';

describe('MedicalImageDetailsComponent', () => {
  let component: MedicalImageDetailsComponent;
  let fixture: ComponentFixture<MedicalImageDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalImageDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalImageDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
