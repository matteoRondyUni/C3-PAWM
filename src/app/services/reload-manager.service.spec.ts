import { TestBed } from '@angular/core/testing';

import { ReloadManagerService } from './reload-manager.service';

describe('ReloadManagerService', () => {
  let service: ReloadManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReloadManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
