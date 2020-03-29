import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationEffects } from './effects/authentication.effects';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forRoot([AuthenticationEffects]),
  ]
})
export class RootEffectsModule { }
