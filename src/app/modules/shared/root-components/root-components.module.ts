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

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    ToastModule
  ],
  declarations: [
    ResponsiveSidenavComponent,
    PlayerBarComponent,
    PlayerBarStationInfoComponent,
    SidenavComponent,
    ToasterContainerComponent
  ],
  exports: [
    ResponsiveSidenavComponent,
    PlayerBarComponent,
    PlayerBarStationInfoComponent,
    SidenavComponent,
    ToasterContainerComponent
  ]
})
export class RootComponentsModule { }
