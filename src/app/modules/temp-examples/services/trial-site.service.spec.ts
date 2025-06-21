import { TestBed } from '@angular/core/testing';

import { TrialSiteService } from './trial-site.service';

describe('TrialSiteService', () => {
  let service: TrialSiteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrialSiteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
