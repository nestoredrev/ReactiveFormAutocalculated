import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {
    
  }


  getPacks(){
    return this.http.get('assets/data/packs.json');
  }

  getActividades(){
    return this.http.get('assets/data/actividades.json');
  }

}
