import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-lifecycle',
  templateUrl: './lifecycle.component.html',
  styleUrls: ['./lifecycle.component.css']
})
export class LifecycleComponent implements OnInit, OnDestroy, OnChanges {

  ngOnInit() {
    console.log('OnInit: Component initialized.');
  }

  ngOnDestroy() {
    console.log('OnDestroy: Component destroyed.');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('OnChanges: Component changes detected.', changes);
  }
}

