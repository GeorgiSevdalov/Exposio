import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpositionDetails } from './exposition-details';

describe('ExpositionDetails', () => {
  let component: ExpositionDetails;
  let fixture: ComponentFixture<ExpositionDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpositionDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpositionDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
