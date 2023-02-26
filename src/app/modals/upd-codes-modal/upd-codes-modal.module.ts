import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdCodesModalPageRoutingModule } from './upd-codes-modal-routing.module';

import { UpdCodesModalPage } from './upd-codes-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdCodesModalPageRoutingModule
  ],
  declarations: [UpdCodesModalPage]
})
export class UpdCodesModalPageModule {}
