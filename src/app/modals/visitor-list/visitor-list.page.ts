import { Component, OnInit } from '@angular/core';
import { ModalController } from "@ionic/angular";
import { Utils } from "../../tools/tools";

@Component({
  selector: 'app-visitor-list',
  templateUrl: './visitor-list.page.html',
  styleUrls: ['./visitor-list.page.scss'],
})
export class VisitorListPage implements OnInit {
  myVisitors:any;
  selectedVisitor:{}

  constructor(
    private modalController : ModalController,

  ) { }

  ngOnInit() {
    this.getVisitors();
  }

  async getVisitors(){
    this.myVisitors = await JSON.parse(localStorage.getItem('visitors'))
    console.log('myVisitors --> ', this.myVisitors);

    //Sort Visitors by name
    this.myVisitors = await Utils.sortJsonVisitors(this.myVisitors,'name',true);

}

toggleSection(item:{}){
  console.log('visitor --> ', item);
  this.selectedVisitor = item;
  this.closeModal();
}

deleteVisitor(item:any){
  console.log('delete --> ', item);
}

  closeModal(){
    this.modalController.dismiss(this.selectedVisitor);
  }

}
