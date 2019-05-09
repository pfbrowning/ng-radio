import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NowPlayingComponent } from './components/now-playing/now-playing.component';
import { NowPlayingRoutingModule } from './now-playing-routing.module';
import { MatButtonModule, MatMenuModule } from '@angular/material';
import { SharedComponentsModule } from '@modules/shared/shared-components/shared-components.module';

@NgModule({
  declarations: [
    NowPlayingComponent
  ],
  imports: [
    CommonModule,
    NowPlayingRoutingModule,
    MatButtonModule,
    MatMenuModule,
    SharedComponentsModule
  ]
})
export class NowPlayingModule { }
