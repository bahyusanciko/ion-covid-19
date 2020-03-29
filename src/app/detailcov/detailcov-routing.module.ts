import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailcovPage } from './detailcov.page';

const routes: Routes = [
  {
    path: '',
    component: DetailcovPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailcovPageRoutingModule {}
