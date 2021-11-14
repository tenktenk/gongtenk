import { TestBed } from '@angular/core/testing';

import { GongleafletspecificService } from './gongleafletspecific.service';

describe('GongleafletspecificService', () => {
  let service: GongleafletspecificService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GongleafletspecificService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
