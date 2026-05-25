import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabtestDetailsComponent } from './labtest-details.component';

describe('LabtestDetailsComponent', () => {
  let component: LabtestDetailsComponent;
  let fixture: ComponentFixture<LabtestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabtestDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabtestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
