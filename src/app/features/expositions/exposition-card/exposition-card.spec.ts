import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpositionCard } from './exposition-card';

describe('ExpositionCard', () => {
  let component: ExpositionCard;
  let fixture: ComponentFixture<ExpositionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpositionCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpositionCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
