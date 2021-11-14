import { NgModule } from '@angular/core';
import { GongtenkspecificComponent } from './gongtenkspecific.component';
import { TenkMapComponent } from './tenk-map/tenk-map.component';

import { GongtenkModule } from 'gongtenk'

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// to split the screen
import { AngularSplitModule } from 'angular-split';

// for angular material
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatTableModule } from '@angular/material/table'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatListModule } from '@angular/material/list'
import { MatCardModule } from '@angular/material/card'
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

// Leaflet
import { GongleafletModule } from 'gongleaflet'
import { GongleafletspecificModule } from 'gongleafletspecific'

// Leaflet
import { GongxlsxModule } from 'gongxlsx'
import { GongxlsxspecificModule } from 'gongxlsxspecific'

// mandatory
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    GongtenkspecificComponent,
    TenkMapComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    HttpClientModule,

    MatSliderModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatTooltipModule,
    MatRadioModule,
    MatSlideToggleModule,
    FormsModule,

    AngularSplitModule,

    GongtenkModule,

    // gongleaflet stack
    GongleafletModule,
    GongleafletspecificModule,

    GongxlsxModule,
    GongxlsxspecificModule

  ],
  exports: [
    GongtenkspecificComponent,
    TenkMapComponent
  ]
})
export class GongtenkspecificModule { }
