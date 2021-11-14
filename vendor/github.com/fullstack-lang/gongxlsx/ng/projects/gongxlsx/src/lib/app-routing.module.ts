import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// insertion point for imports
import { XLCellsTableComponent } from './xlcells-table/xlcells-table.component'
import { XLCellDetailComponent } from './xlcell-detail/xlcell-detail.component'
import { XLCellPresentationComponent } from './xlcell-presentation/xlcell-presentation.component'

import { XLFilesTableComponent } from './xlfiles-table/xlfiles-table.component'
import { XLFileDetailComponent } from './xlfile-detail/xlfile-detail.component'
import { XLFilePresentationComponent } from './xlfile-presentation/xlfile-presentation.component'

import { XLRowsTableComponent } from './xlrows-table/xlrows-table.component'
import { XLRowDetailComponent } from './xlrow-detail/xlrow-detail.component'
import { XLRowPresentationComponent } from './xlrow-presentation/xlrow-presentation.component'

import { XLSheetsTableComponent } from './xlsheets-table/xlsheets-table.component'
import { XLSheetDetailComponent } from './xlsheet-detail/xlsheet-detail.component'
import { XLSheetPresentationComponent } from './xlsheet-presentation/xlsheet-presentation.component'


const routes: Routes = [ // insertion point for routes declarations
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlcells', component: XLCellsTableComponent, outlet: 'github_com_fullstack_lang_gongxlsx_go_table' },
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlcell-adder', component: XLCellDetailComponent, outlet: 'github_com_fullstack_lang_gongxlsx_go_editor' },
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlcell-adder/:id/:originStruct/:originStructFieldName', component: XLCellDetailComponent, outlet: 'github_com_fullstack_lang_gongxlsx_go_editor' },
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlcell-detail/:id', component: XLCellDetailComponent, outlet: 'github_com_fullstack_lang_gongxlsx_go_editor' },
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlcell-presentation/:id', component: XLCellPresentationComponent, outlet: 'github_com_fullstack_lang_gongxlsx_go_presentation' },
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlcell-presentation-special/:id', component: XLCellPresentationComponent, outlet: 'github_com_fullstack_lang_gongxlsx_goxlcellpres' },

	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlfiles', component: XLFilesTableComponent, outlet: 'github_com_fullstack_lang_gongxlsx_go_table' },
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlfile-adder', component: XLFileDetailComponent, outlet: 'github_com_fullstack_lang_gongxlsx_go_editor' },
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlfile-adder/:id/:originStruct/:originStructFieldName', component: XLFileDetailComponent, outlet: 'github_com_fullstack_lang_gongxlsx_go_editor' },
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlfile-detail/:id', component: XLFileDetailComponent, outlet: 'github_com_fullstack_lang_gongxlsx_go_editor' },
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlfile-presentation/:id', component: XLFilePresentationComponent, outlet: 'github_com_fullstack_lang_gongxlsx_go_presentation' },
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlfile-presentation-special/:id', component: XLFilePresentationComponent, outlet: 'github_com_fullstack_lang_gongxlsx_goxlfilepres' },

	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlrows', component: XLRowsTableComponent, outlet: 'github_com_fullstack_lang_gongxlsx_go_table' },
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlrow-adder', component: XLRowDetailComponent, outlet: 'github_com_fullstack_lang_gongxlsx_go_editor' },
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlrow-adder/:id/:originStruct/:originStructFieldName', component: XLRowDetailComponent, outlet: 'github_com_fullstack_lang_gongxlsx_go_editor' },
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlrow-detail/:id', component: XLRowDetailComponent, outlet: 'github_com_fullstack_lang_gongxlsx_go_editor' },
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlrow-presentation/:id', component: XLRowPresentationComponent, outlet: 'github_com_fullstack_lang_gongxlsx_go_presentation' },
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlrow-presentation-special/:id', component: XLRowPresentationComponent, outlet: 'github_com_fullstack_lang_gongxlsx_goxlrowpres' },

	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlsheets', component: XLSheetsTableComponent, outlet: 'github_com_fullstack_lang_gongxlsx_go_table' },
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlsheet-adder', component: XLSheetDetailComponent, outlet: 'github_com_fullstack_lang_gongxlsx_go_editor' },
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlsheet-adder/:id/:originStruct/:originStructFieldName', component: XLSheetDetailComponent, outlet: 'github_com_fullstack_lang_gongxlsx_go_editor' },
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlsheet-detail/:id', component: XLSheetDetailComponent, outlet: 'github_com_fullstack_lang_gongxlsx_go_editor' },
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlsheet-presentation/:id', component: XLSheetPresentationComponent, outlet: 'github_com_fullstack_lang_gongxlsx_go_presentation' },
	{ path: 'github_com_fullstack_lang_gongxlsx_go-xlsheet-presentation-special/:id', component: XLSheetPresentationComponent, outlet: 'github_com_fullstack_lang_gongxlsx_goxlsheetpres' },

];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
