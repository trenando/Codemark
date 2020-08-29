import { Component } from '@angular/core';
import { from, zip, of } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { PhotosAPI } from '../api/api.services';

type DataType = {
  data: {
    image_url?: string
  }
};

export type TagImageElementType = [
  string,
  string | TagImageType[]
];

type TagImageType = [
  string,
  string
];

export type TagImagesArrayGroupType = TagImageElementType[];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private get: PhotosAPI) { }

  API_KEY: string = 'EOZ5eIZAdtYAPUXT7FKjYBGbK9UbzssO';
  tagValue: string = '';
  error: string = 'Введен пустой тэг';
  showError: boolean = false;
  donwloadImage: 'Загрузить' | 'Загрузка...' = 'Загрузить';
  disabled: boolean = false;
  image_url: string;
  grouped: 'Группировать' | 'Разгруппировать' = 'Группировать';
  tagImagesArray: TagImageType[] = [];
  tagImagesArrayGroup: TagImagesArrayGroupType = [];
  sort: boolean = false;

  addTagImage() {
    if (this.tagValue == '') {
      return this.showError = !this.showError;
    } else {
      this.donwloadImage = 'Загрузка...';
      this.disabled = !this.disabled;
      this.get.getData(this.API_KEY, this.tagValue)
        .subscribe(
          (data: DataType) => {
            if (!data.data.image_url) {
              return (this.error = 'По тегу ничего не найдено',
                this.showError = !this.showError);
            } else {
              this.image_url = data.data.image_url;
              this.tagImagesArray.push([this.tagValue, this.image_url])
              return this.tagImagesArray;
            }
          },
          //обработчик ошибок также может принимать err как переменную
          () => {
            return (this.error = 'Произошла http ошибка', this.showError = !this.showError);
          },
          //callback когда стрим завершится
          () => {
            return (this.disabled = !this.disabled, this.donwloadImage = 'Загрузить');
          }
        );
    }
  };

  clearAll() {
    return (this.tagValue = '', this.tagImagesArray = [], this.sort = false, this.grouped = 'Группировать');
  }

  sortImages() {
    if (!this.sort) {
      from(this.tagImagesArray)
        .pipe(
          groupBy(arr => arr[0]),
          mergeMap(group => zip(of(group.key), group.pipe(toArray())))
        )
        .subscribe(val => this.tagImagesArrayGroup.push(val));
      return (this.sort = !this.sort, this.grouped = 'Разгруппировать', this.tagImagesArrayGroup);
    } else {
      return (this.sort = !this.sort, this.grouped = 'Группировать', this.tagImagesArrayGroup = []);
    };
  };

  inputHandler(value: string) {
    return this.tagValue = value;
  };
};
