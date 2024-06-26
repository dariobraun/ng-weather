import { Component, Input, signal } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [NgIf],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css',
})
export class TabComponent {
  @Input() title = '';
  active = signal<boolean>(false);
}
