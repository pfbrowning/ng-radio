import { TestBed, async, ComponentFixture } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { MatIconModule } from '@angular/material/icon'
import { ToastModule } from 'primeng/toast'
import { MessageService } from 'primeng/api'
import { RouterStateService } from '@core/services'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { ConfirmationService } from 'primeng/api'
import {
    GlobalSpinnerStubComponent,
    ToasterContainerStubComponent,
} from '@root-components/testing'
import { RouterStateStubService, CoreSpyFactories } from '@core/testing'
import { AuthenticationFacadeService } from '@core/store'

describe('AppComponent', () => {
    let component: AppComponent
    let fixture: ComponentFixture<AppComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MatIconModule, ToastModule, ConfirmDialogModule],
            declarations: [
                AppComponent,
                GlobalSpinnerStubComponent,
                ToasterContainerStubComponent,
            ],
            providers: [
                MessageService,
                ConfirmationService,
                {
                    provide: RouterStateService,
                    useClass: RouterStateStubService,
                },
                {
                    provide: AuthenticationFacadeService,
                    useValue: CoreSpyFactories.createAuthenticationFacadeSpy(),
                },
            ],
        }).compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent)
        component = fixture.componentInstance
    })

    it('should create the app', () => {
        fixture.detectChanges()

        expect(component).toBeTruthy()
    })
})
