import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstant } from '../constant';

@Injectable({
  providedIn: 'root'
})

export class AnyplaceService {

  apiUrl: string = AppConstant.BASE_API_URL;
  constructor(private http: HttpClient) { }

  getAllCategories() {
    
    let url = this.apiUrl + '/objcategories';
    
    return this.http.get(url);
  }

  getSelectedItemHistory(objectId: string) {
    let url = this.apiUrl + '/history';
    let body = { "obid": objectId }
    let headers = new HttpHeaders({ "Content-Type": "application/json" });

    return this.http.post(url, body, { headers: headers });
  }

  getFloorPlan(buid: string, floorNo: number) {

    let url = this.apiUrl + '/floorplans64/' + buid + '/' + floorNo;
    let headers = new HttpHeaders();
    headers.append("Accept", "text/plain");
    headers.append("Content-Type", "application/json");

    let body = {
      "username": "username",
      "password": "password",
      "buid": buid,
      "access_token": "token",
      "floor_number": floorNo
    };

    return this.http.post(url, body, { headers, responseType: 'text' });

  }

  getFloorCoordinates(buid: string) {
    let url = this.apiUrl + '/mapping/floor/all';
    let headers = new HttpHeaders({ "Content-Type": "application/json" });

    return this.http.post(url, { "buid": buid }, { headers: headers });
  }

}
