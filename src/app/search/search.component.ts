import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subject, throwError, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, catchError, retryWhen, retry } from "rxjs/operators";
import {SearchService} from "../search.service";
import {Router} from '@angular/router'
import { ReturnStatement } from '@angular/compiler';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public loading: boolean;
  public searchTerm = new Subject<string>();
  public baseUrl = "https://rest.bandsintown.com";
  public searchResults: any;
  public paginationElements: any;
  public errorMessage: any;
  public page:any;
  public term: any;

  // public searchEvent = new Subject<string>();
  public searchEventResults: any;
  public eventCount: any;
  public eventCountFlag: any;
  public noEventCountFlag: any;
  
  constructor(private searchService: SearchService, private route:Router) { }
  
  // form group for searching 
  public searchForm = new FormGroup({
    search: new FormControl('', Validators.required),
  });

  // search function to search for term input in formgroup
  public search(){
    this.searchTerm.pipe(
      map((e: any) => {
        console.log(e.target.value);
        this.term = e.target.value;
        return e.target.value
      }),
      debounceTime(400),  //debounce time added to search for term at keyup event after 400ms
      distinctUntilChanged(), //only search if the term on keyup is distinct from previously searched term
      switchMap(term => {
        this.loading = true;
        return this.searchService._searchEntries(term) //call searchservice where term is fetched from API
      }),
      catchError((e) => {
        //handle the error and return it
        console.log(e)
        this.loading = false;
        this.errorMessage = e.message;
        return throwError(e);
      }),
    ).subscribe(v => {
        this.loading = false;
        //return the results and pass the to the paginate module
        this.searchEventResults = false;
        this.searchResults = v;
        this.paginationElements = this.searchResults;
    })
  }


  // search events for artist here, subscribing to the service
  public searchEvents(event){
    // this.searchResults= false;
    console.log("my message", event)
    console.log(this.term)
    this.searchService._searchEvents(this.term).subscribe(v => {
      console.log("term is " + this.term)
      this.loading = false;
      //return the results and pass the to the paginate module
      this.searchEventResults = v;
      console.log("inside search comp" + this.searchEventResults)
      this.eventCount = this.searchEventResults.length;
      console.log(this.eventCount);
      if (this.eventCount > 1){ 
        this.eventCountFlag = true; //means that we want to display no upcoming events message
        this.noEventCountFlag = false;
      }
      else{
        this.noEventCountFlag = true;
        this.eventCountFlag = false;
      }
      // this.paginationElements = this.searchEventResults;
      console.log(this.searchEventResults);
    
    });
  }

  //back funtion linked to button, no longer display the upcoming events on screen
  public back(t){
    console.log(t);
    this.searchEventResults = [];
    this.search();

  }

  ngOnInit() {
    this.search();
  }

}
