import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from '../../../shared/models/menu';
import { MenuHelper } from '../../../shared/models/menu-helper';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NavigationService } from '../../../shared/services/navigation.service';


@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, TranslateModule,NgbNavModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent implements OnInit {
  menuList: MenuItem[] = [];

  // inject services
  private _router = inject(Router);
  private _navigationService = inject(NavigationService);

  ngOnInit(): void {
    this.menuList = MenuHelper.menus;
  }

  onMenuClick(menu: MenuItem) {
    if (menu?.children && menu?.children.length > 0) {
      menu.expanded = !menu.expanded;
    }
  }


}
