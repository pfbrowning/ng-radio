import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NowPlayingComponent } from './components/now-playing/now-playing.component';
import { NowPlayingRoutingModule } from './now-playing-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from '@shared';

@NgModule({
  declarations: [
    NowPlayingComponent
  ],
  imports: [
    CommonModule,
    NowPlayingRoutingModule,
    MatButtonModule,
    MatMenuModule,
    SharedModule
  ]
})
export class NowPlayingModule { }
