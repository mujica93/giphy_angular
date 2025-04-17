import { Component } from '@angular/core';
import { SideMenuHeaderComponent } from "@/gifs/components/side-menu/side-menu-header/side-menu-header.component";
import { SideMenuOptionsComponent } from "@/gifs/components/side-menu/side-menu-options/side-menu-options.component";
import { SideMenuOption } from '@gifs/interfaces/side-menu/side-menu.interface';

@Component({
  selector: 'gifs-side-menu',
  imports: [SideMenuHeaderComponent, SideMenuOptionsComponent],
  templateUrl: './side-menu.component.html'
})

export class SideMenuComponent {

  sideMenu: SideMenuOption[] = [
    {
      icon: 'fa-solid fa-chart-line',
      label: 'Trending',
      route: '/dashboard/trending',
      subLabel: 'Gifs populares',
    },
    {
      icon: 'fa-solid fa-magnifying-glass',
      label: 'Buscar',
      route: '/dashboard/search',
      subLabel: 'Buscar gifs',
    }

  ]

}
