import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import {
  NavController,
  ToastController,
  AlertController,
  LoadingController
} from "@ionic/angular";

import { Http } from '@capacitor-community/http';

declare var google;


@Component({
  selector: "app-detailcov",
  templateUrl: "./detailcov.page.html",
  styleUrls: ["./detailcov.page.scss"],
})
export class DetailcovPage implements OnInit {
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  CountryDet: any = [];
  loading: any;
  covCountry: any = [];
  covProvinsi: any = [];  
  latitude: string;
  longitude: string;
  term: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    private loadingController: LoadingController,
    public alertController: AlertController
  ) {}
  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get("id");
    this.getCountry(id);
  }

  ionViewDidLoad(latitude: string, longtitude: string) {
      let latLng = new google.maps.LatLng(latitude, longtitude);
      let mapOptions = {
        center: latLng,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      // this.getAddress(latitude, longtitude);

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.map.setOptions({draggable: false, zoomControl: false,fullscreenControl: false, scrollwheel: false, disableDoubleClickZoom: true,streetViewControl: false,mapTypeControl: false});
      this.map.addListener('dragend', () => {

        this.latitude = this.map.center.lat();
        this.longitude = this.map.center.lng();

        // this.getAddress(this.map.center.lat(), this.map.center.lng())
      });
  }

  async getCountry(location: any) {
    this.loading = await this.loadingController.create({
      message: "Loading data from api",
    });
    if (location == "Indonesia") {
      this.getProvApi();
    } else {
      this.covProvinsi = null;
    }

    return Http
      .request(
        {
          url: `https://covid19.mathdro.id/api/countries/${location}/confirmed`,
          method: "get",
        }
      )
      .then((res) => {
        this.loading.dismiss();
        this.covCountry = res.data;
        this.ionViewDidLoad(this.covCountry[0].lat, this.covCountry[0].long);
        // console.log(this.covCountry);
        return this.covCountry;
      })
      .catch((res) => {
        // prints 403
        this.errorAlert("aduh");
      });
  }

  getProvApi() {
    return Http
      .request({
        url: `https://api.kawalcorona.com/indonesia/provinsi/`,
        method: "get",
      })
      .then((res) => {
        this.loading.dismiss();
        this.covProvinsi = res.data;
        // console.log(this.covProvinsi);
        return this.covProvinsi;
      })
      .catch((res) => {
        // prints 403
        this.errorAlert("Erorr Data Wilayah");
      });
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
  backHome() {
    this.router.navigateByUrl(`/tabs`);
  }
}
