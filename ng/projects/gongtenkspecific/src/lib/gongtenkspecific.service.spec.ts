import { TestBed } from '@angular/core/testing';

import { GongtenkspecificService } from './gongtenkspecific.service';

describe('GongtenkspecificService', () => {
  let service: GongtenkspecificService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GongtenkspecificService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
