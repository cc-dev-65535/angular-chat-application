import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  //@ViewChildren('link') links: QueryList<ElementRef> | null = null;

  rooms : Array<String> = ["animals", "funny", "food", "random"];

  constructor() {

  }

  ngOnInit(): void {

  }

}
