import { TestBed } from '@angular/core/testing';
import { NoSleepService } from './no-sleep.service';
import { PlayerService } from './player.service';
import { SpyFactories } from '../testing/spy-factories.spec';
import * as NoSleep from 'nosleep.js';
import { NoSleepToken } from '../injection-tokens';

describe('NoSleepService', () => {
  let enabledSpy: jasmine.Spy;
  let noSleepService: NoSleepService;
  let noSleepSpy: jasmine.SpyObj<NoSleep>;
  let playerServiceSpy: jasmine.SpyObj<PlayerService>;

  beforeEach(() => {
    noSleepSpy = SpyFactories.CreateNoSleepSpy();
    playerServiceSpy = SpyFactories.CreatePlayerServiceSpy();

    TestBed.configureTestingModule({
      providers: [
        { provide: PlayerService, useValue: playerServiceSpy },
        { provide: NoSleepToken, useValue: noSleepSpy }
      ]
    });

    noSleepService = TestBed.get(NoSleepService);
    enabledSpy = jasmine.createSpy();
  });

  it('should be created', () => {
    expect(noSleepService).toBeTruthy();
  });

  it('should properly enable and disable', () => {
    /* Before doing anything enabled$ should be false and
    enable should not have been called on the nosleep object yet. */
    noSleepService.enabled$.subscribe(enabled => enabledSpy(enabled));
    expect(enabledSpy).toHaveBeenCalledTimes(1);
    expect(enabledSpy.calls.mostRecent().args).toEqual([false]);
    expect(noSleepSpy.enable).not.toHaveBeenCalled();

    // Enable nosleep
    noSleepService.enable();
    /* After enabling nosleep enabled$ should emit true and
    enable should have been called on the nosleep object once. */
    expect(enabledSpy).toHaveBeenCalledTimes(2);
    expect(enabledSpy.calls.mostRecent().args).toEqual([true]);
    expect(noSleepSpy.enable).toHaveBeenCalledTimes(1);

    /* Disable should not have been called on the nosleep
    object at all immediately before we call disable. */
    expect(noSleepSpy.disable).not.toHaveBeenCalled();

    // Disable nosleep again
    noSleepService.disable();
    /* After turning nosleep back off, enabled$ should emit the
    status again and disabled should be called for the first time. */
    expect(enabledSpy).toHaveBeenCalledTimes(3);
    expect(enabledSpy.calls.mostRecent().args).toEqual([false]);
    expect(noSleepSpy.disable).toHaveBeenCalledTimes(1);
  });

  it('should disable nosleep on audio pause', () => {
    // On init disable should not have been called yet.
    expect(noSleepSpy.disable).not.toHaveBeenCalled();
    // Emit audioPaused
    playerServiceSpy.audioPaused.emit();
    // Nosleep should be disabled now
    expect(noSleepSpy.disable).toHaveBeenCalledTimes(1);
  });
});
