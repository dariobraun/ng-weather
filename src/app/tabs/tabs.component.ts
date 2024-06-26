import {
  AfterContentInit,
  Component,
  ContentChildren,
  Input,
  QueryList,
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
})
export class TabsComponent implements AfterContentInit {
  @Input() closeTabCallback?: (index: number) => void;

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  activeTabIndex = 0;

  ngAfterContentInit() {
    this.selectTab(0);
    this.tabs.changes.subscribe(() => {
      this.selectTab(0);
    });
  }

  selectTab(activeTabIndex: number) {
    this.activeTabIndex = activeTabIndex;
    this.tabs.forEach((tab, index) => {
      tab.active.set(index === activeTabIndex);
    });
  }

  closeTab(indexToClose: number, event: MouseEvent) {
    event.stopPropagation();
    const tabsArray = this.tabs.toArray();
    tabsArray.splice(indexToClose, 1);
    this.tabs.reset(tabsArray);
    if (this.closeTabCallback) {
      this.closeTabCallback(indexToClose);
    }
  }
}
