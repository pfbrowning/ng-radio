import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material';
import { ResponsiveSidenavComponent } from './components/responsive-sidenav/responsive-sidenav.component';

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
  ]
})
export class ResponsiveSidenavModule {}