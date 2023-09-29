import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { SidebarMenuItem } from 'src/app/services/sidebar.service';

interface Accordion {
  multi: boolean;
  displayMode: string;
}

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.scss']
})
export class SidebarItemComponent implements OnInit, OnChanges {

  @Input() menuItem: SidebarMenuItem | null;
  @Input() signOutState = false;
  @Input() activePanel = null;
  @Input() accordion: Accordion = {
    multi: false,
    displayMode: 'flat'
  };

  @Output() panelState = new EventEmitter();

  @ViewChild('equipmentAccordion', { static: false }) equipmentAccordion: ElementRef;

  constructor() {
  }

  ngOnInit(): void {}

  onActivatePanel(panel: string): void {
    this.activePanel = panel;
    this.panelState.emit(panel);
  }

  ngOnChanges(): void {
  }
}
