import { Component, OnInit } from '@angular/core';
import { ModalController} from "@ionic/angular";

@Component({
  selector: 'app-upd-cpus',
  templateUrl: './upd-cpus.page.html',
  styleUrls: ['./upd-cpus.page.scss'],
})
export class UpdCpusPage implements OnInit {

  constructor(
    public modalController : ModalController
  ) { }

  ngOnInit() {
  }

  closeModal(){
    this.modalController.dismiss();
  } 

}
