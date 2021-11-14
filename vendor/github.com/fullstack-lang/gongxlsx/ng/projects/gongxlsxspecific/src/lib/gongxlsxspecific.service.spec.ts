import { TestBed } from '@angular/core/testing';

import { GongxlsxspecificService } from './gongxlsxspecific.service';

describe('GongxlsxspecificService', () => {
  let service: GongxlsxspecificService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GongxlsxspecificService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
