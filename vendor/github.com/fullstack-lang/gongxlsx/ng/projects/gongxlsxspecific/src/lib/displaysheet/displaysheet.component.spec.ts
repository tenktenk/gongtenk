import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaysheetComponent } from './displaysheet.component';

describe('DisplaysheetComponent', () => {
  let component: DisplaysheetComponent;
  let fixture: ComponentFixture<DisplaysheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplaysheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaysheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
