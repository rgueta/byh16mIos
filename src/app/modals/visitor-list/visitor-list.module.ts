import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisitorListPageRoutingModule } from './visitor-list-routing.module';

import { VisitorListPage } from './visitor-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisitorListPageRoutingModule
  ],
  declarations: [VisitorListPage]
})
export class VisitorListPageModule {}
