import { TestBed } from '@angular/core/testing';

import { AuthMagazzinoGuard } from './auth-magazzino.guard';

describe('AuthMagazzinoGuard', () => {
  let guard: AuthMagazzinoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthMagazzinoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
