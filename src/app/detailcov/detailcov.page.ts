import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Storage } from "@ionic/storage";
import {
  NavController,
  ToastController,
  AlertController,
  LoadingController
} from "@ionic/angular";

import { HTTP } from "@ionic-native/http/ngx";

import mapboxgl from "mapbox-gl";

@Component({
  selector: "app-detailcov",
  templateUrl: "./detailcov.page.html",
  styleUrls: ["./detailcov.page.scss"],
})
export class DetailcovPage implements OnInit {
  @ViewChild("map", { static: true }) map: ElementRef;
  CountryDet: any = [];
  loading: any;
  covCountry: any = [];
  covProvinsi: any = [];
  term: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HTTP,
    private router: Router,
    private storage: Storage,
    private loadingController: LoadingController,
    public alertController: AlertController
  ) {}
  ngOnInit() {
    let id = this.activatedRoute.snapshot.paramMap.get("id");
    this.getCountry(id);
  }

  ionViewDidLoad(lat: any, long: any) {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYmFoeXVzYW5jaWtvIiwiYSI6ImNrN3Q5ZmpkazA3bnczbG1rOTZ2dG5hdGYifQ.WiosQS5mManFNE8DXpYgRg";
    var map = new mapboxgl.Map({
      container: this.map.nativeElement,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [long, lat],
      zoom: 5,
    });

    new mapboxgl.Marker({
      id: "symbols",
      type: "symbol",
      source: "points",
      layout: {
        "icon-image": "rocket-15",
      },
    })
      .setLngLat([long, lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }) // add popups
          .setHTML("<h3>Hay </h3><p> Kamu Disini</p>")
      )
      .addTo(map);
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

    return this.http
      .sendRequest(
        `https://covid19.mathdro.id/api/countries/${location}/confirmed`,
        {
          method: "get",
          timeout: 5000,
        }
      )
      .then((res) => {
        this.loading.dismiss();
        this.covCountry = JSON.parse(res.data);
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
    return this.http
      .sendRequest(`https://api.kawalcorona.com/indonesia/provinsi/`, {
        method: "get",
        timeout: 5000,
      })
      .then((res) => {
        this.loading.dismiss();
        this.covProvinsi = JSON.parse(res.data);
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
