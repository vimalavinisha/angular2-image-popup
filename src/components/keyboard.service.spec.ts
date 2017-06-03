import { async, inject, TestBed } from '@angular/core/testing';

import { KeyboardService } from './keyboard.service';

describe('KeyboardService', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [KeyboardService]
    });
  }));

  it('can instantiate service when inject service', inject([KeyboardService], (service: KeyboardService) => {
    expect(service instanceof KeyboardService).toEqual(true);
  }));

  describe('#reset()', () => {
    it('should call reset', inject([KeyboardService], (service: KeyboardService) => {
      service.reset();
    }));
  });

  describe('#add()', () => {
    it('should call add', inject([KeyboardService], (service: KeyboardService) => {
      service.add(() => null);
    }));
  });
});
