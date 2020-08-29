import { Component, Input, Output, EventEmitter } from '@angular/core';

import { TagImageElementType } from '../app.component';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {

  @Input() sort: boolean = false;
  @Input() image_url: string;
  @Input() tagImagesArray: TagImageElementType[] = [];
  @Input() tagImagesArrayGroup: any = [];
  @Input() tagValue: string;
  @Output() changeInputValue = new EventEmitter<string>();
  onChangeInputValue(value: string) {
    this.tagValue = value;
    this.changeInputValue.emit(value);
  }
}
