import { Component } from '@angular/core';
import { from, zip, of } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { PhotosAPI } from '../api/app.services';

//import { state } from '../state/state';

type DataType = {
  data: {
    image_url?: string
  }
};

export type TagArrayType = {
  tag: string,
  image_url: string
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private get: PhotosAPI) { }

  API_KEY: string = 'EOZ5eIZAdtYAPUXT7FKjYBGbK9UbzssO';
  tagValue: string = '';
  tagError: string = 'Введен пустой тэг';
  tagShow: boolean = false;
  tagDownload: 'Загрузить' | 'Загрузка...' = 'Загрузить';
  disabled: boolean = false;
  image_url: string;
  grouped: 'Группировать' | 'Разгруппировать' = 'Группировать';
  tagArray: TagArrayType[] = [];
  tagGroups: any = [];
  sort: boolean = false;

  addTagImage() {
    if (this.tagValue == '') {
      return this.tagShow = !this.tagShow;
    } else {
      this.tagDownload = 'Загрузка...';
      this.disabled = !this.disabled;
      this.get.getData(this.API_KEY, this.tagValue)
        .subscribe(
          (data: DataType) => {
            if (!data.data.image_url) {
              return (this.tagError = 'По тегу ничего не найдено',
                this.tagShow = !this.tagShow);
            } else {
              this.image_url = data.data.image_url;
              this.tagArray.push({ tag: this.tagValue, image_url: this.image_url })
              return this.tagArray;
            }
          },
          //обработчик ошибок также может принимать err как переменную
          () => {
            return (this.tagError = 'Произошла http ошибка', this.tagShow = !this.tagShow);
          },
          //callback когда стрим завершится
          () => {
            return (this.disabled = !this.disabled, this.tagDownload = 'Загрузить');
          }
        );
    }
  };

  clearAll() {
    return (this.tagValue = '', this.tagArray = [], this.sort = false, this.grouped = 'Группировать');
  }

  sortImages() {
    if (!this.sort) {
      from(this.tagArray)
        .pipe(
          groupBy(arr => arr.tag),
          mergeMap(group => zip(of(group.key), group.pipe(toArray())))
        )
        .subscribe(val => this.tagGroups.push(val));
      this.tagGroups.forEach(el => {
        el[1] = el[1].map(element => {
          element = Object.values(element).pop();
          return element;
        });
      });
      return (this.sort = !this.sort, this.grouped = 'Разгруппировать', this.tagGroups);
    } else {
      return (this.sort = !this.sort, this.grouped = 'Группировать', this.tagGroups = []);
    };
  };

  inputHandler(e) {
    return this.tagValue = e.target.value;
  };
};
