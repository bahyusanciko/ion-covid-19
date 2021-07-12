import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import {
  AlertController,
  LoadingController
} from "@ionic/angular";
import mapboxgl from "mapbox-gl";
import { Http } from '@capacitor-community/http';

@Component({
  selector: "app-detailcov",
  templateUrl: "./detailcov.page.html",
  styleUrls: ["./detailcov.page.scss"],
})
export class DetailcovPage implements OnInit {
  @ViewChild('mapbox', { static: false }) set content(content: ElementRef) {
    console.log(this.covCountry[0])
    if (content && this.covCountry[0]) {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYmFoeXVzYW5jaWtvIiwiYSI6ImNrcXdoYnJqcjBvYWUyd282ZGZvZzEyMjAifQ.dKZ47swlv6T4YmQ3uu07vA';
        this.map = new mapboxgl.Map({
            container: content.nativeElement,
            style: "mapbox://styles/mapbox/streets-v11",
            zoom: 12,
            center: [this.covCountry[0].long,this.covCountry[0].lat]
        });
        // Add map controls
        this.map.addControl(new mapboxgl.NavigationControl());
        new mapboxgl.Marker({
            id: "symbols",
            type: "symbol",
            source: "points",
            layout: {
              "icon-image": "rocket-15",
            },
        })
        .setLngLat([this.covCountry[0].long,this.covCountry[0].lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(`<h3>Hello </h3><p> ${this.covCountry[0].countryRegion}</p>`)
        ).addTo(this.map);
    }
  }
  map: any;
  CountryDet: any = [];
  loading: any;
  covCountry: any = [];
  covProvinsi: any = [];  
  latitude: string;
  longitude: string;
  term: any;
  constructor(
    private mapElement: ElementRef,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    private loadingController: LoadingController,
    public  alertController: AlertController
  ) {}
  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get("id");
    this.getCountry(id);
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
        return this.covCountry;
      })
      .catch((res) => {
        // prints 403
        // this.errorAlert("aduh");
        this.loading.dismiss();
      });
    this.loading.present();
  }

  async getProvApi() {
    this.loading = await this.loadingController.create({
      message: "Loading data from api",
    });
    return Http
      .request({
        url: `https://cariteknisi.space/api/getarea`,
        method: "get",
      })
      .then((res) => {
        this.loading.dismiss();
        this.covProvinsi = res.data;
        console.log(this.covProvinsi);
        return this.covProvinsi;
      })
      .catch((res) => {
        this.errorAlert("Erorr Data Wilayah");
        this.loading.dismiss();
      });
    this.loading.present();
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
