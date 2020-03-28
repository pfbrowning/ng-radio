import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsiveSidenavComponent } from './components/responsive-sidenav/responsive-sidenav.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  imports: [
    CommonModule,
    MatSidenavModule
  ],
  declarations: [
    ResponsiveSidenavComponent
  ],
  exports: [
    ResponsiveSidenavComponent
  ]
})
export class RootComponentsModule { }
