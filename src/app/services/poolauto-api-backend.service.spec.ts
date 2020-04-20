import { TestBed } from '@angular/core/testing';

import { PoolautoAPIBackendService } from './poolauto-api-backend.service';

describe('PoolautoAPIBackendService', () => {
  let service: PoolautoAPIBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoolautoAPIBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
