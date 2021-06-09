import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, observable, of, empty } from 'rxjs';
import { map } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public baseUrl = "https://rest.bandsintown.com";
  public searchResults: any;
  public searchEventResults: any;

  constructor(private httpClient: HttpClient) { 
    this.searchResults = [];
    this.searchEventResults = [];
  }


  //makes the HTTP request to get the artist and returns the response as observable;  
  public searchEntries(term): Observable<any>{
    if (term === "" ){
      console.log("Not defined");
      return of(null);
      //return empty();
    }else{
      // let params = {q: term, r: "abc" }
      return this.httpClient.get(this.baseUrl + "/artists/" + term + '?&app_id=abc').pipe(
        map(response => {
          console.log(response)
          this.searchResults=[];
          this.searchResults.push(response);
          console.log(this.searchResults);
          // return this.searchResults = response["items"];
          return this.searchResults
        })
      );
    }
    
  }

  //makes the HTTP request to get the events and returns the response as observable;  
  public searchEvents(term): Observable<any>{
    if (term === "" ){
      console.log("Not defined");
      return of(null);
    }else{
      console.log("inside searchEvents service");
      console.log(this.baseUrl + "/artists/" + term + '/events?&app_id=abc');
      return this.httpClient.get(this.baseUrl + "/artists/" + term + '/events?&app_id=abc').pipe(
        map(response => {
          console.log(response) 
          this.searchEventResults=[];
          // this.searchEventResults.push(response);
            this.searchEventResults.push(response);
            // element.product_desc = element.product_desc.substring(0,10);
          console.log("len of searchEventResults "+ this.searchEventResults.length);
          console.log(this.searchEventResults);
          return response
          // return this.searchEventResults
        })
      );
    }
    
  }

  //returns the response for the first method
  public _searchEntries(term){
    return this.searchEntries(term);
  }

  //returns the response for the second method
  public _searchEvents(term){
    return this.searchEvents(term);
  }
}
