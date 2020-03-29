import { Component, OnInit } from "@angular/core";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"]
})
export class Tab2Page implements OnInit {
  constructor(private iab: InAppBrowser) {}

  ngOnInit() {}

  kitabisa() {
    this.iab.create(
      `https://kitabisa.com/campaign/indonesialawancorona`,
      `_blank`
    );
  }
}
