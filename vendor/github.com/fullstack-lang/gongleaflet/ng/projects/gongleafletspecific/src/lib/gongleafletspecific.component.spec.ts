import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GongleafletspecificComponent } from './gongleafletspecific.component';

describe('GongleafletspecificComponent', () => {
  let component: GongleafletspecificComponent;
  let fixture: ComponentFixture<GongleafletspecificComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GongleafletspecificComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GongleafletspecificComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
