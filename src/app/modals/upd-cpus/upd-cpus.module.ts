import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdCpusPageRoutingModule } from './upd-cpus-routing.module';

import { UpdCpusPage } from './upd-cpus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdCpusPageRoutingModule
  ],
  declarations: [UpdCpusPage]
})
export class UpdCpusPageModule {}
