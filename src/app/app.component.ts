import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, zip, of } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';

type DataType = {
  data: {
    image_url?: string
  }
};

type TagArrayType = {
  tag: string,
  image_url: string
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private http: HttpClient) { }

  API_KEY: string = 'EOZ5eIZAdtYAPUXT7FKjYBGbK9UbzssO';
  tagValue: string = '';
  tagError: string = 'Введен пустой тэг';
  tagShow: 'none' | 'block' = 'none';
  tagDownload: 'Загрузить' | 'Загрузка...' = 'Загрузить';
  disabled: boolean = false;
  image_url: string;
  grouped: 'Группировать' | 'Разгруппировать' = 'Группировать';
  tagArray: TagArrayType[] = [];
  tagGroups: any = [];
  sort: boolean = false;
  firstSort: boolean = true;

  addTagImage() {
    if (this.tagValue == '') {
      return this.tagShow = 'block';
    } else {
      this.tagDownload = 'Загрузка...';
      this.disabled = true;
      this.http.get(`https://api.giphy.com/v1/gifs/random?api_key=${this.API_KEY}&tag=${this.tagValue}`)
        .subscribe(
          (data: DataType) => {
            if (!data.data.image_url) {
              return (this.tagError = 'По тегу ничего не найдено',
                this.tagShow = 'block');
            } else {
              this.image_url = data.data.image_url;
              this.tagArray.push({ tag: this.tagValue, image_url: this.image_url })
              return this.tagArray;
            }
          },
          //обработчик ошибок также может принимать err как переменную
          () => {
            return (this.tagError = 'Произошла http ошибка', this.tagShow = 'block');
          },
          //callback когда стрим завершится
          () => {
            return (this.disabled = false, this.tagDownload = 'Загрузить');
          }
        );
    }
  };

  clearAll() {
    return this.tagValue = '';
  }

  sortImages() {
    if (this.firstSort) {
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
      this.firstSort = false;
    } else{
      this.firstSort = true;
      this.tagGroups = [];
    };
    if (!this.sort) {
      this.grouped = 'Разгруппировать';
    } else {
      this.grouped = 'Группировать';
    }
    return (this.sort = !this.sort, this.grouped);
  };

  inputHandler(e) {
    return this.tagValue = e.target.value;
  };
};
