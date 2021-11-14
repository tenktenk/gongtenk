import { Component, OnInit } from '@angular/core';

import * as gongxlsx from 'gongxlsx'


type Constructor = new () => Object;

const json2Instance = (source: string, destinationConstructor: Constructor) =>
  Object.assign(new destinationConstructor(), JSON.parse(source));

const ELEMENT_DATA: any[] = [
];
@Component({
  selector: 'lib-displaysheet',
  templateUrl: './displaysheet.component.html',
  styleUrls: ['./displaysheet.component.css']
})
export class DisplaysheetComponent implements OnInit {

  columns = [] as any
  dataSource = ELEMENT_DATA;
  displayedColumns: string[] = []

  public gongxlsxFrontRepo?: gongxlsx.FrontRepo

  constructor(
    private gongxlsxFrontRepoService: gongxlsx.FrontRepoService,
  ) { }

  ngOnInit(): void {
    this.gongxlsxFrontRepoService.pull().subscribe(
      gongxlsxsFrontRepo => {
        this.gongxlsxFrontRepo = gongxlsxsFrontRepo

        if (this.gongxlsxFrontRepo.XLFiles.size == 0) {
          console.error("cannot deal with 0 file")
        }

        let gongXLFile = this.gongxlsxFrontRepo.XLFiles_array[0]

        if (gongXLFile.Sheets!.length == 0) {
          console.error("cannot deal with 0 sheets")
        }

        let gongXLSheet = gongXLFile.Sheets![0]

        // cells are provided in random order. on need to order them in the correct order
        let contentArray = new Array<string[]>(gongXLSheet.NbRows)

        for (let rowNb = 0; rowNb < gongXLSheet.NbRows; rowNb++) {
          contentArray[rowNb] = new Array<string>(gongXLSheet.MaxCol)
        }

        for (let gongXLCell of gongXLSheet.SheetCells!) {
          contentArray[gongXLCell.Y][gongXLCell.X] = gongXLCell.Name
        }

        // now one need to fill up element data with synthetic object
        for (let rowNb = 1; rowNb < gongXLSheet.NbRows; rowNb++) {
          let oneRow = [] as any
          for (let columnNb = 0; columnNb < gongXLSheet.MaxCol; columnNb++) {
            oneRow[contentArray[0][columnNb]] = contentArray[rowNb][columnNb]
          }
          ELEMENT_DATA.push(oneRow)
        }


        for (let columnNb = 0; columnNb < gongXLSheet.MaxCol; columnNb++) {

          this.columns.push(
            {
              columnDef: contentArray[0][columnNb],
              header: contentArray[0][columnNb],
              cell: (element: any) => `${element[contentArray[0][columnNb]]}`
            }
          )
        }

        // make up displayed columns
        this.displayedColumns = this.columns.map((c: { columnDef: any; }) => c.columnDef);

        console.log(this.displayedColumns)
      }
    )
  }

}
