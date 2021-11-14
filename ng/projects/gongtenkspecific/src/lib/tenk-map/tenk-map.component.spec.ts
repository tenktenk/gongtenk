import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenkMapComponent } from './tenk-map.component';

describe('TenkMapComponent', () => {
  let component: TenkMapComponent;
  let fixture: ComponentFixture<TenkMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenkMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenkMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
