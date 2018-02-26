import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { DataService } from './data.service';
import { TimeService } from './time.service';

import { AppComponent } from './app.component';

import { ChartContainerComponent } from './chart-container/chart-container.component';
import { AreaChartComponent } from './chart-container/area-chart/area-chart.component';
import { JapaneseCandlesticksComponent } from './chart-container/japanese-candlesticks/japanese-candlesticks.component';
import { RateGridComponent } from './chart-container/rate-grid/rate-grid.component';
import { HeaderComponent } from './header/header.component';


@NgModule({
  declarations: [
    AppComponent,

    ChartContainerComponent,
    AreaChartComponent,
    JapaneseCandlesticksComponent,
    RateGridComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [
    DataService,
    TimeService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
