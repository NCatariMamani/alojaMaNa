/*import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.css']
})
export class FullComponent implements OnInit {

  isCondensed = false;
  $bodyObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'style'
      ) {
        this.resizeSidebar();
      }
    }
  });
  constructor(
    private elementRef: ElementRef,
  ) { }

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



  changeSidebar(value: string) {
    switch (value) {
      case 'light':
        document.body.setAttribute('data-sidebar', 'light');
        document.body.setAttribute('data-topbar', 'light');
        document.body.removeAttribute('data-sidebar-size');
        document.body.removeAttribute('data-layout-size');
        document.body.removeAttribute('data-keep-enlarged');
        document.body.classList.remove('vertical-collpsed');
        document.body.removeAttribute('data-layout-scrollable');
        break;
      case 'compact':
        document.body.setAttribute('data-sidebar-size', 'small');
        document.body.setAttribute('data-sidebar', 'dark');
        document.body.removeAttribute('data-topbar');
        document.body.removeAttribute('data-layout-size');
        document.body.removeAttribute('data-keep-enlarged');
        document.body.classList.remove('sidebar-enable');
        document.body.classList.remove('vertical-collpsed');
        document.body.removeAttribute('data-layout-scrollable');
        break;
      case 'dark':
        document.body.setAttribute('data-sidebar', 'dark');
        document.body.removeAttribute('data-topbar');
        document.body.removeAttribute('data-layout-size');
        document.body.removeAttribute('data-keep-enlarged');
        document.body.removeAttribute('data-sidebar-size');
        document.body.classList.remove('sidebar-enable');
        document.body.classList.remove('vertical-collpsed');
        document.body.removeAttribute('data-layout-scrollable');
        break;
      case 'icon':
        document.body.classList.add('vertical-collpsed');
        document.body.setAttribute('data-sidebar', 'dark');
        document.body.removeAttribute('data-layout-size');
        document.body.setAttribute('data-keep-enlarged', 'true');
        document.body.removeAttribute('data-topbar');
        document.body.removeAttribute('data-layout-scrollable');
        break;
      case 'colored':
        document.body.classList.remove('sidebar-enable');
        document.body.classList.remove('vertical-collpsed');
        document.body.setAttribute('data-sidebar', 'colored');
        document.body.removeAttribute('data-layout-size');
        document.body.removeAttribute('data-keep-enlarged');
        document.body.removeAttribute('data-topbar');
        document.body.removeAttribute('data-layout-scrollable');
        document.body.removeAttribute('data-sidebar-size');
        break;
      default:
        document.body.setAttribute('data-sidebar', 'dark');
        break;
    }
  }

  resizeSidebar() {
    const header = document.querySelector('header');
    const body = document.querySelector('footer');
    if (!header || !body) {
      return;
    }

    const headerRect = header.getBoundingClientRect();
    const bodyRect = body.getBoundingClientRect();
    const heightPx = Math.abs(bodyRect.top - headerRect.bottom) - 20;
    const sidebar = document.querySelector('.vertical-menu') as HTMLDivElement;
    if (!sidebar) {
      return;
    }
    sidebar.style.maxHeight = heightPx + 'px';
    sidebar.style.height = 'auto';
  }

  ngAfterViewInit() {
    const body = this.elementRef.nativeElement.querySelector('.page-content');
    // this.$bodyObserver.observe(body, {
    //   attributes: true,
    //   childList: true,
    //   characterData: true,
    //   subtree: true,
    // });
  }


  ngOnDestroy() {
    this.$bodyObserver.disconnect();
  }
}*/



import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SIDEBAR_TYPE } from 'src/app/common/constants/layouts';
import { EventService } from 'src/app/common/services/event.service';
import { ScriptService } from 'src/app/common/services/script.service';

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.html'],
})
export class FullComponent implements OnInit {
  isCondensed = false;
  sidebartype?: string;
  date1 = new Date().getFullYear();
  scriptsToRemove: string[] = [
    'https://framework-gb.cdn.gob.mx/gm/v4/js/jquery.min.js',
    'https://framework-gb.cdn.gob.mx/gm/v4/js/bootstrapV4.min.js',
    'https://framework-gb.cdn.gob.mx/gm/v4/js/main.js',
  ];
  $bodyObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'style'
      ) {
        this.resizeSidebar();
      }
    }
  });
  constructor(
    private router: Router,
    private scriptService: ScriptService,
    private eventService: EventService,
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    let script = this.document.getElementById('my-script');
    if (!script) {
      // this.scriptService
      //   .loadScript({
      //     id: 'my-script',
      //     url: 'https://framework-gb.cdn.gob.mx/gm/v4/js/gobmx.js',
      //   })
      //   .then(data => {})
      //   .catch(error => console.log(error));
      this.router.events.forEach(event => {
        if (event instanceof NavigationEnd) {
          document.body.classList.remove('sidebar-enable');
        }
      });
    }
  }

  ngOnInit(): void {
    this.sidebartype = SIDEBAR_TYPE;
    // listen to event and change the layout, theme, etc
    this.eventService.subscribe('changeSidebartype', (layout: string) => {
      this.sidebartype = layout;
      this.changeSidebar(this.sidebartype);
    });

    this.changeSidebar(this.sidebartype);

    document.body.setAttribute('data-layout', 'vertical');
  }
  isMobile() {
    const ua = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
      ua
    );
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
  }

  changeSidebar(value: string) {
    switch (value) {
      case 'light':
        document.body.setAttribute('data-sidebar', 'light');
        document.body.setAttribute('data-topbar', 'light');
        document.body.removeAttribute('data-sidebar-size');
        document.body.removeAttribute('data-layout-size');
        document.body.removeAttribute('data-keep-enlarged');
        document.body.classList.remove('vertical-collpsed');
        document.body.removeAttribute('data-layout-scrollable');
        break;
      case 'compact':
        document.body.setAttribute('data-sidebar-size', 'small');
        document.body.setAttribute('data-sidebar', 'dark');
        document.body.removeAttribute('data-topbar');
        document.body.removeAttribute('data-layout-size');
        document.body.removeAttribute('data-keep-enlarged');
        document.body.classList.remove('sidebar-enable');
        document.body.classList.remove('vertical-collpsed');
        document.body.removeAttribute('data-layout-scrollable');
        break;
      case 'dark':
        document.body.setAttribute('data-sidebar', 'dark');
        document.body.removeAttribute('data-topbar');
        document.body.removeAttribute('data-layout-size');
        document.body.removeAttribute('data-keep-enlarged');
        document.body.removeAttribute('data-sidebar-size');
        document.body.classList.remove('sidebar-enable');
        document.body.classList.remove('vertical-collpsed');
        document.body.removeAttribute('data-layout-scrollable');
        break;
      case 'icon':
        document.body.classList.add('vertical-collpsed');
        document.body.setAttribute('data-sidebar', 'dark');
        document.body.removeAttribute('data-layout-size');
        document.body.setAttribute('data-keep-enlarged', 'true');
        document.body.removeAttribute('data-topbar');
        document.body.removeAttribute('data-layout-scrollable');
        break;
      case 'colored':
        document.body.classList.remove('sidebar-enable');
        document.body.classList.remove('vertical-collpsed');
        document.body.setAttribute('data-sidebar', 'colored');
        document.body.removeAttribute('data-layout-size');
        document.body.removeAttribute('data-keep-enlarged');
        document.body.removeAttribute('data-topbar');
        document.body.removeAttribute('data-layout-scrollable');
        document.body.removeAttribute('data-sidebar-size');
        break;
      default:
        document.body.setAttribute('data-sidebar', 'dark');
        break;
    }
  }

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    this.isCondensed = !this.isCondensed;
    document.body.classList.toggle('sidebar-enable');
    document.body.classList.toggle('vertical-collpsed');

    if (window.screen.width <= 768) {
      document.body.classList.remove('vertical-collpsed');
    }
  }

  resizeSidebar() {
    const header = document.querySelector('header');
    const body = document.querySelector('footer');
    if (!header || !body) {
      return;
    }

    const headerRect = header.getBoundingClientRect();
    const bodyRect = body.getBoundingClientRect();
    const heightPx = Math.abs(bodyRect.top - headerRect.bottom) - 20;
    const sidebar = document.querySelector('.vertical-menu') as HTMLDivElement;
    if (!sidebar) {
      return;
    }
    sidebar.style.maxHeight = heightPx + 'px';
    sidebar.style.height = 'auto';
  }

  ngAfterViewInit() {
    const body = this.elementRef.nativeElement.querySelector('.page-content');
    // this.$bodyObserver.observe(body, {
    //   attributes: true,
    //   childList: true,
    //   characterData: true,
    //   subtree: true,
    // });
  }

  ngOnDestroy() {
    this.$bodyObserver.disconnect();
  }
}
