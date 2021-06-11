import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerBarStationInfoComponent } from './player-bar-station-info.component';
import { getElementTextBySelector } from '@utilities/testing';
import { Station, PlayerStatus } from '@core/models/player';
import { SharedModule } from '@shared';

describe('PlayerBarStationInfoComponent', () => {
    let component: PlayerBarStationInfoComponent;
    let fixture: ComponentFixture<PlayerBarStationInfoComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [PlayerBarStationInfoComponent],
            imports: [SharedModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerBarStationInfoComponent);
        component = fixture.componentInstance;
        component.currentStation = new Station();
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    const playerStatusTemplateInput = [
        {
            playerStatus: PlayerStatus.LoadingAudio,
            expected: 'Loading Audio...',
        },
        {
            playerStatus: PlayerStatus.Stopped,
            expected: '',
        },
        {
            streamInfo: 'Valid Title',
            playerStatus: PlayerStatus.Playing,
            expected: 'Valid Title',
        },
    ];
    playerStatusTemplateInput.forEach((input, index) => {
        it(`should reflect the various player states properly in the template ${index}`, () => {
            // Arrange & Act
            component.currentPlayerStatus = input.playerStatus;
            component.metadataForCurrentStation = input.streamInfo;
            fixture.detectChanges();

            // Assert: Ensure that the text of the title element conveys the current stream status
            expect(
                getElementTextBySelector<PlayerBarStationInfoComponent>(
                    fixture,
                    '.title'
                )
            ).toBe(input.expected);
        });
    });
});
