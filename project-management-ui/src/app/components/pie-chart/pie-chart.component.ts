import { Component, OnInit, NgZone, Input, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { ApiService } from 'src/app/services/api.service';
import { ChartsData } from 'src/app/pages/workspace/workspace.model';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, OnChanges, OnDestroy {

  fullscreen = false;
  private chart: am4charts.PieChart;

  @Input() title = null;
  @Input() data: ChartsData[] = [];
  @Input() update = false;

  @Output() onFullscreen = new EventEmitter();
  @Output() viewDetails = new EventEmitter();

  constructor( 
    private zone: NgZone,
    private service: ApiService
  ) { }

  ngOnInit(): void {
  }

  drawChart() {
    const chart = am4core.create(this.title + '-graph', am4charts.PieChart);
    chart.hiddenState.properties.opacity = 0;

    this.data.filter((item, index: number) => {
      item.color = this.service.am4chartColors[index];
    });

    chart.data = this.data;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "label";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.labels.template.text = "{category}: {value.value}";

    // chart.radius = am4core.percent(100);
    chart.radius = am4core.percent(window.innerWidth <= 869 ? 50 : 80);

    // This creates initial animation
    if (!this.update) {
      pieSeries.hiddenState.properties.opacity = 1;
      pieSeries.hiddenState.properties.endAngle = -90;
      pieSeries.hiddenState.properties.startAngle = -90;
    }

    // chart.hiddenState.properties.radius = am4core.percent(0);
    chart.hiddenState.properties.radius = am4core.percent(this.update ? 70 : 0);

    this.chart = chart;
  }

  onToggleFullscreen() {
    this.fullscreen = !this.fullscreen;
    
    if (this.fullscreen) {
      this.service.scollToTop();
    }

    setTimeout(() => {
      this.onFullscreen.emit(this.fullscreen);
    });
  }

  onVeiwDetails(): void {
    this.viewDetails.emit({
      title: this.title,
      data: this.data
    });
  }

  ngOnChanges() {
    // console.log('data:', this.data);
    setTimeout(() => {
      this.zone.runOutsideAngular(() => {
        this.drawChart();
      });
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) { this.chart.dispose(); }
    });
  }
}
