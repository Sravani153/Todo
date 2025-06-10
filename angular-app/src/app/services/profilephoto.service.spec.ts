import { TestBed } from '@angular/core/testing';

import { ProfilephotoService } from './profilephoto.service';

describe('ProfilephotoService', () => {
  let service: ProfilephotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfilephotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
