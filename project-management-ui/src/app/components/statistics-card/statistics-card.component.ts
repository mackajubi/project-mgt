import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistics-card',
  templateUrl: './statistics-card.component.html',
  styleUrls: ['./statistics-card.component.scss']
})
export class StatisticsCardComponent implements OnInit {

  @Input() title = null;
  @Input() icon = null;
  @Input() data = 0;
  @Input() text = 0;
  @Input() background = null;
  @Input() bubbleColor = null;
  @Input() currency = false;
  @Input() color = '#fff';
  @Input() symbol = null;

  constructor() { }

  ngOnInit(): void {
  }

}
