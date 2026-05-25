import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncounterConfirmationComponent } from './encounter-confirmation.component';

describe('EncounterConfirmationComponent', () => {
  let component: EncounterConfirmationComponent;
  let fixture: ComponentFixture<EncounterConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncounterConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncounterConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
