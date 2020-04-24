import { StreamUrlValidatorDirective } from './stream-url-validator.directive';
import { createChangeDetectorRefSpy } from '@utilities/testing';
import { createStreamValidatorServiceSpy } from '@core/testing';

describe('StreamUrlValidatorDirective', () => {
  it('should create an instance', () => {
    const directive = new StreamUrlValidatorDirective(
      createStreamValidatorServiceSpy(),
      createChangeDetectorRefSpy()
    );
    expect(directive).toBeTruthy();
  });
});
