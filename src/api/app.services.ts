import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PhotosAPI {

  constructor(protected http: HttpClient) { }

  getData(API_KEY: string, API_VALUE: string) {
    return this.http.get(`https://api.giphy.com/v1/gifs/random?api_key=${API_KEY}&tag=${API_VALUE}`);
  }

}
