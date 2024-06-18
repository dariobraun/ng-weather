import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  DestroyRef,
  inject,
  Input,
  QueryList,
  signal,
  SimpleChanges,
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent implements AfterContentInit {
  @Input() closeTabCallback?: (index: number) => void;

  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  destroyRef = inject(DestroyRef);
  activeTabIndex = signal(0);

  constructor() {
    toObservable(this.activeTabIndex).subscribe((activeTabIndex) => {
      this.tabs.forEach((tab, index) =>
        tab.active.set(index === activeTabIndex),
      );
    });
  }

  ngAfterContentInit() {
    this.tabs.changes
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((change: SimpleChanges) => {
        const tabRemoved =
          change.changes.previousValue?.length <
          change.changes.currentValue?.length;
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
