import { TestBed } from '@angular/core/testing';

import { AuthMagazziniereGuard } from './auth-magazziniere.guard';

describe('AuthMagazziniereGuard', () => {
  let guard: AuthMagazziniereGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthMagazziniereGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
