import {
  AfterContentInit,
  Component,
  ContentChildren,
  QueryList,
  signal,
  SimpleChanges,
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { NgFor } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgFor],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  activeTabIndex = signal(0);

  constructor() {
    toObservable(this.activeTabIndex).subscribe((activeTabIndex) => {
      this.tabs.forEach((tab, index) =>
        tab.active.set(index === activeTabIndex),
      );
    });
  }

  ngAfterContentInit() {
    this.tabs.changes.subscribe((change: SimpleChanges) => {
      const tabRemoved =
        change.changes.previousValue?.length <
        change.changes.currentValue.length;
      if (tabRemoved) {
        this.selectTab(0);
      } else {
        this.selectTab(this.tabs.length - 1);
      }
    });
  }

  selectTab(activeTabIndex: number) {
    this.activeTabIndex.set(activeTabIndex);
  }

  closeBtn(indexToClose: number, event: MouseEvent) {
    event.stopPropagation();
  }
}
