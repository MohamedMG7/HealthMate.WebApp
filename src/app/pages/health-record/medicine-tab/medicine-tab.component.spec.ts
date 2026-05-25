import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineTabComponent } from './medicine-tab.component';

describe('MedicineTabComponent', () => {
  let component: MedicineTabComponent;
  let fixture: ComponentFixture<MedicineTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicineTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicineTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
