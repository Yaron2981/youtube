import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
})
export class TemplateComponent {
  miniSidebar: boolean = true;
  miniSideTriggerEvent(trigger: boolean) {
    this.miniSidebar = !trigger;
  }
}
