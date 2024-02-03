import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsiveSidenavComponent } from './components/responsive-sidenav/responsive-sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PlayerBarComponent } from './components/player-bar/player-bar.component';
import { PlayerBarStationInfoComponent } from './components/player-bar-station-info/player-bar-station-info.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SharedModule } from '@shared';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ToasterContainerComponent } from './components/toaster-container/toaster-container.component';
import { ToastModule } from 'primeng/toast';
import { StationEditComponent } from './components/station-edit/station-edit.component';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
<<<<<<< HEAD
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
=======
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
>>>>>>> master
import { GlobalSpinnerComponent } from './components/global-spinner/global-spinner.component';
import { AppShellComponent } from './components/app-shell/app-shell.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    ToastModule,
    DialogModule,
  ],
  declarations: [
    ResponsiveSidenavComponent,
    PlayerBarComponent,
    PlayerBarStationInfoComponent,
    SidenavComponent,
    ToasterContainerComponent,
    StationEditComponent,
    GlobalSpinnerComponent,
    AppShellComponent,
  ],
  exports: [
    ResponsiveSidenavComponent,
    PlayerBarComponent,
    PlayerBarStationInfoComponent,
    SidenavComponent,
    ToasterContainerComponent,
    StationEditComponent,
    GlobalSpinnerComponent,
    AppShellComponent,
  ],
})
export class RootComponentsModule {}
