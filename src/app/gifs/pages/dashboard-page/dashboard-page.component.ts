import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SideMenuComponent } from "@gifs/components/side-menu/side-menu.component";

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterModule, SideMenuComponent],
  templateUrl: './dashboard-page.component.html'
})

class DashboardPageComponent { }

export default DashboardPageComponent;
