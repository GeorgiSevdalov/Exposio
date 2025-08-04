import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpositionList } from './exposition-list';

describe('ExpositionList', () => {
  let component: ExpositionList;
  let fixture: ComponentFixture<ExpositionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpositionList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpositionList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
