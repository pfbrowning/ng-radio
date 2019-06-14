import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ResponsiveSidenavComponent } from './components/responsive-sidenav/responsive-sidenav.component';
import { WindowToken } from './injection-tokens/window-token';

@NgModule({
  declarations: [
    ResponsiveSidenavComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule
  ],
  exports: [
    ResponsiveSidenavComponent
  ],
  providers: [
    { provide: WindowToken, useValue: window },
  ]
})
export class ResponsiveSidenavModule {}
