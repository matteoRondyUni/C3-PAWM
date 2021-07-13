import { TestBed } from '@angular/core/testing';

import { AuthNegozioGuard } from './auth-negozio.guard';

describe('AuthNegozioGuard', () => {
  let guard: AuthNegozioGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthNegozioGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
