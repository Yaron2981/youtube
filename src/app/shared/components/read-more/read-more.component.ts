import {
  Component,
  Input,
  ElementRef,
  AfterViewInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'read-more',
  template: `
    <div
      [innerHTML]="text"
      [class.collapsed]="isCollapsed"
      [style.height]="isCollapsed ? maxHeight + 'px' : 'auto'"
    ></div>
    <a
      [class.collapsed]="!isCollapsed"
      *ngIf="isCollapsable"
      (click)="isCollapsed = !isCollapsed"
    >
      {{ isCollapsed ? moreText : lessText }}
    </a>
  `,
  styles: [
    `
      div.collapsed {
        overflow: hidden;
      }
      a {
        cursor: pointer;
      }
      a.collapsed {
        display: inline-block;
        margin-top: 15px;
      }
    `,
  ],
})
export class ReadMoreComponent implements AfterViewInit {
  //the text that need to be put in the container
  @Input() text: string = '';

  //maximum height of the container
  @Input() maxHeight: number = 100;

  @Input() moreText: string = 'Read more';
  @Input() lessText: string = 'Read less';

  //set these to false to get the height of the expended container
  public isCollapsed: boolean = false;
  public isCollapsable: boolean = false;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    setTimeout(() => {
      let currentHeight =
        this.elementRef.nativeElement.getElementsByTagName('div')[0]
          .offsetHeight;
      //collapsable only if the contents make container exceed the max height
      if (currentHeight > this.maxHeight) {
        this.isCollapsed = true;
        this.isCollapsable = true;
      }
    }, 1000);
  }
}
