import { Component } from '@angular/core';

import { AppServices } from '../state/app.services';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
})
export class ContentComponent {

  constructor(public appService: AppServices) { }

  onChangeInputValue(value: string) {
    this.appService.inputHandler(value);
  }
}
