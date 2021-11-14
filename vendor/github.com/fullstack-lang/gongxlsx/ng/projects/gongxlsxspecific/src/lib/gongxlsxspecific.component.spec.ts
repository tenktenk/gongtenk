import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GongxlsxspecificComponent } from './gongxlsxspecific.component';

describe('GongxlsxspecificComponent', () => {
  let component: GongxlsxspecificComponent;
  let fixture: ComponentFixture<GongxlsxspecificComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GongxlsxspecificComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GongxlsxspecificComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
