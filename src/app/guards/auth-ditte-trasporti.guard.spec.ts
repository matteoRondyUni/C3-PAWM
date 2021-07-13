import { TestBed } from '@angular/core/testing';

import { AuthDitteTrasportiGuard } from './auth-ditte-trasporti.guard';

describe('AuthDitteTrasportiGuard', () => {
  let guard: AuthDitteTrasportiGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthDitteTrasportiGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
