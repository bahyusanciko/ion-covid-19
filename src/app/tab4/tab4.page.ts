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
  AUTH_SERVER_ADDRESS: string = "https://apiapps.maxistyle.com/api/getvaksin";
  apiVax: any = [];
  respone: any;
  loading: any;
  page_number = 1;
  page_limit = 50;
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
        this.respone = res.data.data;
        for (let key in res.data.data) {
          this.apiVax.push(res.data.data[key]);
        }
        console.log(this.apiVax)
        this.loading.dismiss();
      })
      .catch((res) => {
        this.errorAlert('Segara hadir');
        this.loading.dismiss();
      });
      if (isFirstLoad){
        event.target.complete();
        this.page_number ++;
      }
    this.loading.present();
  }
  
  doInfinite(event) {
    this.page_number =+ 49
    this.page_limit =+ 50
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
