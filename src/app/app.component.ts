import { Component } from '@angular/core';
import { AppServices } from './state/app.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public appService: AppServices) { }

  addTagImage() {
    this.appService.addTagImage();
  };

  clearAll() {
    this.appService.clearAll();
  }

  sortImages() {
    this.appService.sortImages();
  };

  inputHandler(value: string) {
    this.appService.inputHandler(value);
  };
};
