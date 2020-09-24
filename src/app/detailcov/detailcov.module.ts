import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { DetailcovPageRoutingModule } from "./detailcov-routing.module";

import { DetailcovPage } from "./detailcov.page";
import { Ng2SearchPipeModule } from "ng2-search-filter";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailcovPageRoutingModule,
    Ng2SearchPipeModule,
  ],
  declarations: [DetailcovPage],
})
export class DetailcovPageModule {}
