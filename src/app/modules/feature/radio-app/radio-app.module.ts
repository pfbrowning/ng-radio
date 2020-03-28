import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioAppComponent } from './components/radio-app/radio-app.component';
import { RadioAppRoutingModule } from './radio-app-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlayerBarComponent } from './components/player-bar/player-bar.component';
import { PlayerBarStationInfoComponent } from './components/player-bar-station-info/player-bar-station-info.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SharedComponentsModule } from '@shared-components';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RootComponentsModule } from '../../shared/root-components/root-components.module';

@NgModule({
  declarations: [
    RadioAppComponent,
    PlayerBarComponent,
    PlayerBarStationInfoComponent,
    SidenavComponent
  ],
  imports: [
    CommonModule,
    RadioAppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RootComponentsModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    SharedComponentsModule,
    RootComponentsModule
  ]
})
export class RadioAppModule { }

export { PlayerBarComponent, PlayerBarStationInfoComponent, SidenavComponent };
