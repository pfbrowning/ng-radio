import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { StreamUrlValidatorDirective } from './directives/stream-url-validator.directive';
import { StationIconDirective } from './directives/station-icon.directive';
import { MetadataTextComponent } from './components/metadata-text/metadata-text.component';

@NgModule({
  imports: [CommonModule, MatMenuModule],
  declarations: [StreamUrlValidatorDirective, StationIconDirective, MetadataTextComponent],
  exports: [MetadataTextComponent, StreamUrlValidatorDirective, StationIconDirective],
})
export class SharedModule {}
