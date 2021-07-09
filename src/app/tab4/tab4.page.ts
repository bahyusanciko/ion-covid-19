import { Component, ViewChild, OnInit } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import {
  NavController,
  Platform,
  AlertController,
  LoadingController,
} from "@ionic/angular";
import { Http } from '@capacitor-community/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  AUTH_SERVER_ADDRESS: string = "https://cariteknisi.space/api/getvaksin";
  apiVax: any;
  loading: any;
  page_number = 1;
  page_limit = 8;
  @ViewChild(IonInfiniteScroll,{ static: false }) infiniteScroll: IonInfiniteScroll;

  constructor(
    public  alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadData(false, "");
  }

  async loadData(isFirstLoad,event) {
    this.loading = await this.loadingController.create({
      message: "Loading data from api",
    });
    Http.request({
        url: `${this.AUTH_SERVER_ADDRESS}/${this.page_number}/${this.page_limit}`,
        method: "get",
      })
      .then((res) => {
        this.loading.dismiss();        
        this.apiVax.push(res.data);
        console.log(this.apiVax)
        this.apiVax
      })
      .catch((res) => {
        this.loading.dismiss();
        this.errorAlert('Segara hadir');
        res.status;
      });
      if (isFirstLoad){
        event.target.complete();
        this.page_number ++;
      }
    this.loading.present();
  }
  
  doInfinite(event) {
    this.loadData(true, event);
  }


  async errorAlert(err: any) {
    const alert = await this.alertController.create({
      header: "Error",
      // subHeader: "Subtitle",
      message: err,
      buttons: ["OK"],
    });
    await alert.present();
  }

}
