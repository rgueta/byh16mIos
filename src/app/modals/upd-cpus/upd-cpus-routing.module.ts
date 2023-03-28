import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdCpusPage } from './upd-cpus.page';

const routes: Routes = [
  {
    path: '',
    component: UpdCpusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdCpusPageRoutingModule {}
