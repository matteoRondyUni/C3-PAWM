import { TestBed } from '@angular/core/testing';

import { AuthCorriereGuard } from './auth-corriere.guard';

describe('AuthCorriereGuard', () => {
  let guard: AuthCorriereGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthCorriereGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
