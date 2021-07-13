import { TestBed } from '@angular/core/testing';

import { AuthCommercianteGuard } from './auth-commerciante.guard';

describe('AuthCommercianteGuard', () => {
  let guard: AuthCommercianteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthCommercianteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
