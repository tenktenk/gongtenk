import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GongtenkspecificComponent } from './gongtenkspecific.component';

describe('GongtenkspecificComponent', () => {
  let component: GongtenkspecificComponent;
  let fixture: ComponentFixture<GongtenkspecificComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GongtenkspecificComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GongtenkspecificComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
