import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpositionForm } from './exposition-form';

describe('ExpositionForm', () => {
  let component: ExpositionForm;
  let fixture: ComponentFixture<ExpositionForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpositionForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpositionForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
