import { SideMenuOption } from '@/gifs/interfaces/side-menu/side-menu.interface';
import { GiphyService } from '@/gifs/services/giphy/giphy.service';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'gifs-side-menu-options',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu-options.component.html'
})
export class SideMenuOptionsComponent {

  sideMenu: SideMenuOption[] = [
    {
      icon: 'fa-solid fa-chart-line px-2',
      label: 'Trending',
      route: '/dashboard/trending',
      subLabel: 'Gifs populares',
    },
    {
      icon: 'fa-solid fa-magnifying-glass px-2',
      label: 'Buscar',
      route: '/dashboard/search',
      subLabel: 'Buscar gifs',
    }

  ];

  //dependencies
  giphyService = inject(GiphyService);

  //methods


}
