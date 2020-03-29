import { Component, OnInit, ViewChild } from "@angular/core";
import * as HighCharts from "highcharts";
import {
  NavController,
  Platform,
  AlertController,
  LoadingController,
  IonInfiniteScroll
} from "@ionic/angular";
import { HTTP } from "@ionic-native/http/ngx";
import { Storage } from "@ionic/storage";
import { Router } from "@angular/router";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"]
})
export class Tab1Page implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: false })
  infiniteScroll: IonInfiniteScroll;

  dataList: any;

  AUTH_SERVER_ADDRESS: string = "https://covid19.mathdro.id/api/";
  loading: any;
  apiCov: any = [];
  IndoCov: any = [];
  location: any = [];
  index: number;
  constructor(
    private http: HTTP,
    public alertController: AlertController,
    private loadingController: LoadingController,
    private storage: Storage,
    private router: Router
  ) {}
  ngOnInit() {
    this.BarChart();
    this.getIndoApi();
    this.getCountryApi();
  }

  async BarChart() {
    let data = await this.getCovapi();
    let myChart = HighCharts.chart("highcharts", {
      chart: {
        type: "bar"
      },
      title: {
        text: "Informasi Penyebaran Virus Corona Seluruh Dunia"
      },
      xAxis: {
        categories: ["Positif", "Sembuh", "Meninggal"]
      },
      yAxis: {
        title: {
          text: "Informasi Data Covid-19"
        }
      },
      series: [
        {
          name: "Covid-19",
          type: undefined,
          data: [data.confirmed.value, data.recovered.value, data.deaths.value]
        }
      ]
    });
  }

  async getCovapi() {
    this.loading = await this.loadingController.create({
      message: "Loading data from api"
    });

    return this.http
      .sendRequest(`${this.AUTH_SERVER_ADDRESS}`, {
        method: "get",
        timeout: 5000
      })
      .then(res => {
        this.loading.dismiss();
        this.apiCov = JSON.parse(res.data);
        return this.apiCov;
      })
      .catch(res => {
        // prints 403
        this.errorAlert(res.status);
        return res.status;
      });
    this.loading.present();
  }

  async getIndoApi() {
    this.loading = await this.loadingController.create({
      message: "Loading data from api"
    });

    return this.http
      .sendRequest(`${this.AUTH_SERVER_ADDRESS}countries/indonesia/confirmed`, {
        method: "get",
        timeout: 5000
      })
      .then(res => {
        this.loading.dismiss();
        this.IndoCov = JSON.parse(res.data);
        this.storage.set("indonesia", this.IndoCov);
        return this.IndoCov;
      })
      .catch(res => {
        // prints 403
        this.errorAlert(res.status);
        return res.status;
      });
    this.loading.present();
  }

  async getallAsync(): Promise<void> {
    return await this.storage.get("country").then(res => (this.location = res));
  }

  async getCountryApi() {
    this.location = await this.getallAsync();
    if (this.location == null || this.location == undefined) {
      return this.http
        .sendRequest(`https://covid19.mathdro.id/api/countries/`, {
          method: "get",
          timeout: 5000
        })
        .then(res => {
          this.location = JSON.parse(res.data);
          this.storage.set("country", this.location);
          this.allCountry();
          return this.location;
        })
        .catch(res => {
          // prints 403
          this.errorAlert(res.status);
          return this.getCountryApi();
        });
    } else {
      this.allCountry();
      return this.location;
    }
  }

  async allCountry() {
    this.location = await this.getallAsync();
    if (this.location == null || this.location == undefined) {
      this.getCountryApi();
    } else {
      this.dataList = [];
      for (let i = 0; i < 25; i++) {
        this.dataList.push(this.location.countries[i].name);
        this.index = i;
      }
    }
  }
  countryRegion(location: string) {
    this.router.navigateByUrl(`/detailcov/${location}`);
  }

  async loadData(event) {
    this.location = await this.getallAsync();
    setTimeout(() => {
      console.log("Done");
      let count = this.index + 25;
      this.dataList = [];
      for (let i = this.index; i < count; i++) {
        this.dataList.push(this.location.countries[i].name);
        this.index = i;
      }
      if (this.dataList.length == 176) {
        event.target.disabled = true;
      }

      event.target.complete();
    }, 1000);
  }

  async errorAlert(err: any) {
    const alert = await this.alertController.create({
      header: "Error",
      // subHeader: "Subtitle",
      message: err,
      buttons: ["OK"]
    });
    await alert.present();
  }
}
