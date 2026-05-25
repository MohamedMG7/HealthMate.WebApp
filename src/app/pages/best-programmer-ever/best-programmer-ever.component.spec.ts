import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestProgrammerEverComponent } from './best-programmer-ever.component';

describe('BestProgrammerEverComponent', () => {
  let component: BestProgrammerEverComponent;
  let fixture: ComponentFixture<BestProgrammerEverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestProgrammerEverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestProgrammerEverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
