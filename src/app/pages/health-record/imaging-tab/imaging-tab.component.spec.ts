import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagingTabComponent } from './imaging-tab.component';

describe('ImagingTabComponent', () => {
  let component: ImagingTabComponent;
  let fixture: ComponentFixture<ImagingTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagingTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
