import {
  Directive,
  Input,
  OnChanges,
  HostBinding,
  SimpleChanges,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { map, switchMap, distinctUntilChanged, filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { SubSink } from 'subsink';
import isFalsyOrWhitespace from 'is-falsy-or-whitespace';
import { ConfigProviderService } from 'src/app/modules/core/services/config/config-provider.service';

@Directive({ selector: '[blrStationIcon]' })
export class StationIconDirective implements OnChanges, OnInit, OnDestroy {
  @Input() iconUrl: string;
  @Input() minWidth = 35;
  @Input() minHeight = 35;
  @HostBinding() src;

  private fallbackImage = '/assets/images/radio.svg';
  private iconUrlSource = new BehaviorSubject<string | null>(null);
  private subs = new SubSink();

  private proxiedIconUrl$ = this.iconUrlSource.pipe(
    filter(url => !isFalsyOrWhitespace(url)),
    distinctUntilChanged(),
    switchMap(iconUrl =>
      this.configProvider
        .getConfigOnceLoaded()
        .pipe(map(appConfig => `${appConfig.imageProxyUrl}/image?url=${iconUrl}`))
    )
  );

  constructor(private configProvider: ConfigProviderService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.iconUrl) {
      this.iconUrlSource.next(changes.iconUrl.currentValue);
    }
  }

  ngOnInit(): void {
    this.subs.sink = this.proxiedIconUrl$.subscribe(url => (this.src = url));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  @HostListener('error', ['$event']) onError() {
    this.src = this.fallbackImage;
  }

  @HostListener('load', ['$event']) onLoadComplete(event) {
    /* Once the image loads, if it's smaller than our min dimensions, then use the fallback.
    Intentionally check the rendered "width" & "height", rather than "naturalWidth" and
    "naturalHeight", because dimensionless images (such as svg) don't have natural dimensions. */
    const width = event.target.width;
    const height = event.target.width;
    const dimensionsValid = width >= this.minWidth && height >= this.minHeight;
    if (!dimensionsValid) {
      this.src = this.fallbackImage;
    }
  }
}
