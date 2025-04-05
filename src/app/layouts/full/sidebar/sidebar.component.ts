import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import MetisMenu from 'metismenujs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IMenuItem } from 'src/app/core/interfaces/menu.interface';
import { MENU_JEFE_NEGOCIO, MENU_ADMIN_SIS, MENU_ENCARGADO } from 'src/app/core/menu';
import { IRole } from 'src/app/core/models/catalogs/role.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RoleService } from 'src/app/core/services/authentication/role.service';
//import { MENU } from 'src/app/core/menu';
//import { AuthService } from 'src/app/core/services/authentication/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
    `
      .scrollbar-menu {
        --scrollbar-thumb-color:rgb(2, 118, 147);
        --scrollbar-thumb-hover-color: var(--scrollbar-thumb-color);
      }
    `,
  ],
})
export class SidebarComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('componentRef') scrollRef: any;
  @Input() isCondensed = false;
  private menu: any;
  public menuItems: IMenuItem[] = [];
  userAuth: any = {};
  role: any = {};

  menus: any[] = [];

  @ViewChild('sideMenu') sideMenu?: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private roleService: RoleService
  ) { }

  ngOnInit() {
    this.userAuth = this.authService.getUserInfo();
    this.initialize();
  }

  ngAfterViewInit() {
    this.router.events.forEach(event => {
      if (event instanceof NavigationEnd) {
        this._activateMenuDropdown();
        this._scrollElement();
      }
    });
    this._scrollElement();
    if (this.sideMenu) {
      this.menu = new MetisMenu(this.sideMenu?.nativeElement);
    }
    this._activateMenuDropdown();
  }

  toggleMenu(event: any) {
    event.currentTarget.nextElementSibling.classList.toggle('mm-show');
  }

  ngOnChanges() {
    if ((!this.isCondensed && this.sideMenu) || this.isCondensed) {
      setTimeout(() => {
        if (this.sideMenu) {
          this.menu = new MetisMenu(this.sideMenu!.nativeElement);
        }
      });
    } else if (this.menu) {
      this.menu.dispose();
    }
  }
  _scrollElement() {
    setTimeout(() => {
      if (document.getElementsByClassName('mm-active').length > 0) {
        const currentPosition: any =
          document.getElementsByClassName('mm-active')[0];
        let position = currentPosition.offsetTop;
        if (position > 500) {
          this.scrollRef.scrollTo({ top: position + 300, duration: 0 });
        }
        // if (this.scrollRef.SimpleBar !== null)
        //   this.scrollRef.SimpleBar.getScrollElement().scrollTop =
        //     position + 300;
      }
    }, 300);
  }

  /**
   * remove active and mm-active class
   */
  _removeAllClass(className: string) {
    const els = document.getElementsByClassName(className);
    while (els[0]) {
      els[0].classList.remove(className);
    }
  }

  /**
   * Activate the parent dropdown
   */
  _activateMenuDropdown() {
    this._removeAllClass('mm-active');
    this._removeAllClass('mm-show');
    const links: any = document.getElementsByClassName('side-nav-link-ref');
    let menuItemEl = null;
    // tslint:disable-next-line: prefer-for-of
    const paths = [];
    for (let i = 0; i < links.length; i++) {
      paths.push(links[i]['pathname']);
    }
    var itemIndex = paths.indexOf(window.location.pathname);

    if (itemIndex === -1) {
      const strIndex = window.location.pathname.lastIndexOf('/');
      const item = window.location.pathname.substr(0, strIndex).toString();
      menuItemEl = links[paths.indexOf(item)];
    } else {
      menuItemEl = links[itemIndex];
    }

    if (menuItemEl) {
      menuItemEl.classList.add('active');
      const parentEl = menuItemEl.parentElement;

      if (parentEl) {
        parentEl.classList.add('mm-active');
        const parent2El = parentEl.parentElement.closest('ul');
        if (parent2El && parent2El.id !== 'side-menu') {
          parent2El.classList.add('mm-show');
          const parent3El = parent2El.parentElement;
          if (parent3El && parent3El.id !== 'side-menu') {
            //se agrega parentElement por app dinamico
            parent3El.parentElement.classList.add('mm-active');
            const childAnchor = parent3El.querySelector('.has-arrow');
            const childDropdown = parent3El.querySelector('.has-dropdown');
            if (childAnchor) {
              childAnchor.classList.add('mm-active');
            }
            if (childDropdown) {
              childDropdown.classList.add('mm-active');
            }
            const parent4El = parent3El.parentElement;
            if (parent4El && parent4El.id !== 'side-menu') {
              //se agrega parentElement por app dinamico
              parent4El.parentElement.classList.add('mm-show');

              const parent5El = parent4El.parentElement;
              if (parent5El && parent5El.id !== 'side-menu') {
                //se agrega parentElement por app dinamico
                parent5El.parentElement.classList.add('mm-active');
                const childanchor = parent5El.querySelector('.is-parent');
                if (childanchor && parent5El.id !== 'side-menu') {
                  childanchor.classList.add('mm-active');
                }

                /*IF MENU NIVEL 3*/
                const parent6El = parent5El.parentElement;
                if (parent6El && parent6El.id !== 'side-menu') {
                  //se agrega parentElement por app dinamico
                  parent6El.parentElement.classList.add('mm-show');
                  parent6El.parentElement.classList.add('mm-active');
                  const childanchor = parent6El.querySelector('.is-parent');
                  if (childanchor && parent6El.id !== 'side-menu') {
                    childanchor.classList.add('mm-show');
                    childanchor.classList.add('mm-active');
                  }

                  const parent7El = parent5El.parentElement;
                  if (parent7El && parent7El.id !== 'side-menu') {
                    //se agrega parentElement por app dinamico
                    parent7El.parentElement.classList.add('mm-show');
                    parent7El.parentElement.classList.add('mm-active');
                    const childanchor = parent7El.querySelector('.is-parent');
                    if (childanchor && parent7El.id !== 'side-menu') {
                      childanchor.classList.add('mm-show');
                      childanchor.classList.add('mm-active');
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  /**
   * Initialize
   */
  private initialize() {
    if (this.userAuth.role == 1) {
      //console.log(this.userAuth.role);
      this.menuItems = []; // Limpia los ítems anteriores
      let idAd = 0;
      MENU_ADMIN_SIS.forEach(menu => {
        if (Array.isArray(menu.subItems) && menu.subItems.length > 0) {
          menu.id = idAd;
          idAd = this.setParentId(menu, menu.id);
          //console.log(menu);
        } else {
          menu.id = idAd;
          idAd++;
        }
        this.menuItems.push(menu);
      });
    } else if (this.userAuth.role == 2) {
      this.menuItems = []; // Limpia los ítems anteriores
      let idAd = 0;
      MENU_JEFE_NEGOCIO.forEach(menu => {
        if (Array.isArray(menu.subItems) && menu.subItems.length > 0) {
          menu.id = idAd;
          idAd = this.setParentId(menu, menu.id);
          //console.log(menu);

        } else {
          menu.id = idAd;
          idAd++;
        }
        this.menuItems.push(menu);
      });
    } else {
      this.menuItems = []; // Limpia los ítems anteriores
      let idAd = 0;
      MENU_ENCARGADO.forEach(menu => {
        if (Array.isArray(menu.subItems) && menu.subItems.length > 0) {
          menu.id = idAd;
          idAd = this.setParentId(menu, menu.id);
          //console.log(menu);

        } else {
          menu.id = idAd;
          idAd++;
        }
        this.menuItems.push(menu);
      });
    }


  }

  async getByIdRole(idRole: number) {
    const params = new ListParams();
    //params['filter.roleId'] = `$eq:${idRole}`;
    return new Promise((resolve, reject) => {
      this.roleService.getById(idRole).subscribe({
        next: response => {
          resolve(response);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }

  private setParentId(menuItem: IMenuItem, id: number): number {
    if (Array.isArray(menuItem.subItems)) {
      menuItem.subItems.forEach(sub => {
        id++;
        sub.id = id;
        sub.parentId = menuItem.id;
        if (Array.isArray(sub.subItems) && sub.subItems.length > 0) {
          sub.id = id;
          id = this.setParentId(sub, sub.id);
        }
      });
      return id;
    } else {
      return 0;
    }

  }
  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: IMenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }
}
