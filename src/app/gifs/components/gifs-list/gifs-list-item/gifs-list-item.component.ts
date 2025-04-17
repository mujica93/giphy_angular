import { Component, input } from '@angular/core';

@Component({
  selector: 'gifs-list-item',
  imports: [],
  templateUrl: './gifs-list-item.component.html',
})

export class GifsListItemComponent {

  url = input.required<string>();

  onClipboard(){
    window.navigator.clipboard.writeText(this.url())
  };

  openTab(){
    window.open(this.url(), '_blank');
  }

}
