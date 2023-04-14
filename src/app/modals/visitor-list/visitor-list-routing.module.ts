import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisitorListPage } from './visitor-list.page';

const routes: Routes = [
  {
    path: '',
    component: VisitorListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisitorListPageRoutingModule {}
