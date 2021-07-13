import { TestBed } from '@angular/core/testing';

import { AuthClienteGuard } from './auth-cliente.guard';

describe('AuthClienteGuard', () => {
  let guard: AuthClienteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthClienteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
