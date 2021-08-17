import { TestBed } from '@angular/core/testing';

import { InfoOrdineLoaderService } from './info-ordine-loader.service';

describe('InfoOrdineLoaderService', () => {
  let service: InfoOrdineLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoOrdineLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
