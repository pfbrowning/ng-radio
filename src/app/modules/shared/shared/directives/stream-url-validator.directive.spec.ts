import { StreamUrlValidatorDirective } from './stream-url-validator.directive'
import { createChangeDetectorRefSpy } from '@utilities/testing'
import { CoreSpyFactories } from '@core/testing'

describe('StreamUrlValidatorDirective', () => {
    it('should create an instance', () => {
        const directive = new StreamUrlValidatorDirective(
            CoreSpyFactories.createAudioProxyService(),
            createChangeDetectorRefSpy()
        )
        expect(directive).toBeTruthy()
    })
})
