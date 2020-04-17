import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StreamInfoTextComponent } from './stream-info-text.component';
import { NowPlaying, StreamInfoStatus, PlayerStatus } from '@core/models/player';
import { getElementTextBySelector } from '@utilities/testing';
import { By } from '@angular/platform-browser';
import theoretically from 'jasmine-theories';

describe('StreamInfoTextComponent', () => {
  let component: StreamInfoTextComponent;
  let fixture: ComponentFixture<StreamInfoTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamInfoTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamInfoTextComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  
  const streamInfoTemplateInput = [
    {
      streamInfo: {
        nowPlaying: null,
        status: StreamInfoStatus.LoadingStreamInfo
      },
      expected: 'Loading Stream Info...'
    },
    {
      streamInfo: {
        nowPlaying: null,
        status: StreamInfoStatus.Error
      },
      expected: 'Metadata Unavailable'
    },
    {
      streamInfo: {
        nowPlaying: new NowPlaying('Valid Title', null),
        status: StreamInfoStatus.Valid
      },
      expected: 'Valid Title'
    },
    {
      streamInfo: {
        nowPlaying: new NowPlaying('Valid Title', null),
        status: StreamInfoStatus.LoadingStreamInfo
      },
      expected: 'Valid Title'
    },
    {
      streamInfo: {
        nowPlaying: new NowPlaying(null, null, null, null, 'Valid Description'),
        status: StreamInfoStatus.Valid
      },
      expected: 'Valid Description'
    },
  ];
  theoretically.it('should reflect the various streamInfoStatus states properly in the template',
    streamInfoTemplateInput, (input) => {
    // Arrange & Act
    component.streamInfo = input.streamInfo;
    fixture.detectChanges();

    expect(fixture.debugElement.nativeElement.innerText).toBe(input.expected);
  });
});
