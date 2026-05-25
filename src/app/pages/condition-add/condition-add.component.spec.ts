import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionAddComponent } from './condition-add.component';

describe('ConditionAddComponent', () => {
  let component: ConditionAddComponent;
  let fixture: ComponentFixture<ConditionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConditionAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConditionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
