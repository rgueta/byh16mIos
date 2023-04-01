import { Component, OnInit } from '@angular/core';
import { ModalController} from "@ionic/angular";
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-upd-cpus',
  templateUrl: './upd-cpus.page.html',
  styleUrls: ['./upd-cpus.page.scss'],
})
export class UpdCpusPage implements OnInit {
  public userId : any;
  public CoresList:any;

  constructor(
    public modalController : ModalController,
    public api : DatabaseService,
  ) { }

  ngOnInit() {
  }


  

  closeModal(){
    this.modalController.dismiss();
  } 

}
