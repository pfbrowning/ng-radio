import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioAppComponent } from './components/radio-app/radio-app.component';
import { RadioAppRoutingModule } from './radio-app-routing.module';
import { MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule } from '@angular/material';
import { ResponsiveSidenavModule } from '@modules/core/responsive-sidenav/responsive-sidenav.module';
import { PlayerBarComponent } from './components/player-bar/player-bar.component';
import { PlayerBarStationInfoComponent } from './components/player-bar-station-info/player-bar-station-info.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SharedComponentsModule } from '@modules/shared/shared-components/shared-components.module';

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
    ResponsiveSidenavModule,
    MatMenuModule,
    MatTooltipModule,
    SharedComponentsModule
  ]
})
export class RadioAppModule { }

export { PlayerBarComponent, PlayerBarStationInfoComponent, SidenavComponent };
