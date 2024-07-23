import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.css']
})
export class FullComponent implements OnInit {

  isCondensed = false;
  constructor() { }

  ngOnInit() {
  }

  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
  }

  onToggleMobileMenu() {
    this.isCondensed = !this.isCondensed;
    document.body.classList.toggle('sidebar-enable');
    document.body.classList.toggle('vertical-collpsed');

    if (window.screen.width <= 768) {
      document.body.classList.remove('vertical-collpsed');
    }
  }

}
