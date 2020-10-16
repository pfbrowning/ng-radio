import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { GlobalSpinnerComponent } from './global-spinner.component'
import { DialogModule } from 'primeng/dialog'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

describe('GlobalSpinnerComponent', () => {
    let component: GlobalSpinnerComponent
    let fixture: ComponentFixture<GlobalSpinnerComponent>

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GlobalSpinnerComponent],
            imports: [
                DialogModule,
                NoopAnimationsModule,
                MatProgressSpinnerModule,
            ],
        }).compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(GlobalSpinnerComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })
})
