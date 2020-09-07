import { Injectable } from '@angular/core';
import { from, zip, of } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { PhotosAPI } from '../../api/api.services';

type DataType = {
  data: {
    image_url?: string
  }
};

type TagImageElementType = [
  string,
  string | TagImageType[]
];

type TagImageType = [
  string,
  string
];

type TagImagesArrayGroupType = TagImageElementType[];

@Injectable({ providedIn: 'root' })
export class AppServices {

  constructor(private api: PhotosAPI) { }

  API_KEY: string = 'EOZ5eIZAdtYAPUXT7FKjYBGbK9UbzssO';
  tagValue: string = '';
  showError: boolean = false;
  error: string = '';
  donwloadImage: 'Загрузить' | 'Загрузка...' = 'Загрузить';
  tagImagesArray: TagImageType[] = [];
  grouped: 'Группировать' | 'Разгруппировать' = 'Группировать';
  sort: boolean = false;
  disabled: boolean = false;
  image_url: string;
  tagImagesArrayGroup: TagImagesArrayGroupType = [];

  addTagImage() :void {
    if (this.tagValue == '') {
      this.showError = true;
      this.error = 'Введен пустой тэг';
    } else {
      this.donwloadImage = 'Загрузка...';
      this.disabled = !this.disabled;
      this.api.getData(this.API_KEY, this.tagValue)
        .subscribe(
          (data: DataType) => {
            if (!data.data.image_url) {
              this.error = 'По тегу ничего не найдено';
              this.showError = true;
            } else {
              this.image_url = data.data.image_url;
              this.tagImagesArray.push([this.tagValue, this.image_url])
              this.tagImagesArray;
            }
          },
          //обработчик ошибок также может принимать err как переменную
          () => {
            this.error = 'Произошла http ошибка';
            this.showError = true;
          },
          //callback когда стрим завершится
          () => {
            this.disabled = !this.disabled;
            this.donwloadImage = 'Загрузить';
          }
        );
    }
  };

  clearAll(): void {
    this.tagValue = '';
    this.tagImagesArray = [];
    this.sort = false;
    this.grouped = 'Группировать';
    this.tagImagesArrayGroup = [];
  }

  sortImages(): void {
    if (!this.sort) {
      from(this.tagImagesArray)
        .pipe(
          groupBy(arr => arr[0]),
          mergeMap(group => zip(of(group.key), group.pipe(toArray())))
        )
        .subscribe(val => this.tagImagesArrayGroup.push(val));
      this.sort = !this.sort;
      this.grouped = 'Разгруппировать';
      this.tagImagesArrayGroup;
    } else {
      this.sort = !this.sort;
      this.grouped = 'Группировать';
      this.tagImagesArrayGroup = [];
    };
  };

  inputHandler(value: string) : void {
    this.tagValue = value;
  };

};

