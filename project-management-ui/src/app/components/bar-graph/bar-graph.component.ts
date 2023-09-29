import { Component, OnInit, NgZone, Input, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ChartsData } from 'src/app/pages/workspace/workspace.model';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
  selector: 'app-bar-graph',
  templateUrl: './bar-graph.component.html',
  styleUrls: ['./bar-graph.component.scss']
})
export class BarGraphComponent implements OnInit, OnChanges, OnDestroy {

  fullscreen = false;
  private root: am5.Root;

  @Input() title = null;
  @Input() data: ChartsData[] = [];
  @Input() update = false;
  @Input() xAxisLabelRotation = 0;
  @Input() xAxisLabelVisibility = true;

  @Output() onFullscreen = new EventEmitter();
  @Output() viewDetails = new EventEmitter();

  constructor( 
    private zone: NgZone,
    private service: ApiService
  ) { }

  ngOnInit(): void {
  }

  drawChart(data: ChartsData[]) {
    let root = am5.Root.new(this.title + '-graph');

    root.setThemes([am5themes_Animated.new(root)]);

    // let chart = root.container.children.push(
    //   am5xy.XYChart.new(root, {
    //     panY: false,
    //     // layout: root.verticalLayout
    //     layout: root.horizontalLayout
    //   })
    // );

    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true,
      layout: root.horizontalLayout,
    }));    

    // Cursor
    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);    

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 30,
      inversed: true
    });

    xRenderer.labels.template.setAll({
      rotation: this.xAxisLabelRotation,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15,
    });

    xRenderer.grid.template.setAll({
      location: 0
    })

    let xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      maxDeviation: 0.3,
      categoryField: "label",
      visible: this.xAxisLabelVisibility,
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1
      })
    }));

    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let series = chart.series.push(am5xy.ColumnSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "count",
      sequencedInterpolation: true,
      categoryXField: "label",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueY}"
      })
    }));

    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5, strokeOpacity: 0 });
    series.columns.template.adapters.add("fill", function(fill, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", function(stroke, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    xAxis.data.setAll(data);
    series.data.setAll(data);
    
    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);    


    // // Create Y-axis
    // let yAxis = chart.yAxes.push(
    //   am5xy.ValueAxis.new(root, {
    //     renderer: am5xy.AxisRendererY.new(root, {})
    //   })
    // );

    // // Create X-Axis
    // let xAxis = chart.xAxes.push(
    //   am5xy.CategoryAxis.new(root, {
    //     renderer: am5xy.AxisRendererX.new(root, {}),
    //     categoryField: "label"
    //   })
    // );
    // xAxis.data.setAll(data);

    // // Color Set
    // chart.get("colors").set("colors", [
    //   am5.color(0x095256),
    //   am5.color(0x087f8c),
    //   am5.color(0x5aaa95),
    //   am5.color(0x86a873),
    //   am5.color(0xbb9f06)
    // ]);    

    // // Create series
    // let series1 = chart.series.push(
    //   am5xy.ColumnSeries.new(root, {
    //     name: "Series",
    //     xAxis: xAxis,
    //     yAxis: yAxis,
    //     valueYField: "count",
    //     categoryXField: "label",
    //     fill: am5.color(0x095256),
    //     stroke: am5.color(0x095256),        
    //     tooltip: am5.Tooltip.new(root, {
    //       labelText: "[bold]{name}[/]\n{categoryX}: {valueY} ltrs"
    //     })        
    //   })
    // );
    // series1.data.setAll(data);

    // Add legend
    // let legend = chart.children.push(am5.Legend.new(root, {}));
    // legend.data.setAll(chart.series.values);

    // Add cursor
    // chart.set("cursor", am5xy.XYCursor.new(root, {}));

    this.root = root;    
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
    if (this.data.length) {
      setTimeout(() => {
        this.zone.runOutsideAngular(() => {
          this.drawChart(this.data);
        });
      });
    }
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.root) { this.root.dispose(); }
    });
  }
}
