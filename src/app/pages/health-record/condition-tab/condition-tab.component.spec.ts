import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionTabComponent } from './condition-tab.component';

describe('ConditionTabComponent', () => {
  let component: ConditionTabComponent;
  let fixture: ComponentFixture<ConditionTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConditionTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConditionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
