import { NgModule } from '@angular/core';
import { GongxlsxspecificComponent } from './gongxlsxspecific.component';
import { DisplaysheetComponent } from './displaysheet/displaysheet.component';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser'



@NgModule({
  declarations: [
    GongxlsxspecificComponent,
    DisplaysheetComponent
  ],
  imports: [
    BrowserModule,
    MatTableModule,
  ],
  exports: [
    GongxlsxspecificComponent,
    DisplaysheetComponent
  ]
})
export class GongxlsxspecificModule { }
