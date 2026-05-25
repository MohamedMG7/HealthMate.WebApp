import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTabComponent } from './lab-tab.component';

describe('LabTabComponent', () => {
  let component: LabTabComponent;
  let fixture: ComponentFixture<LabTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
