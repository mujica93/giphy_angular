import { Gif } from '@/gifs/interfaces/gif/gif.interface';
import { Component, input } from '@angular/core';
import { GifsListItemComponent } from '@gifs/components/gifs-list/gifs-list-item/gifs-list-item.component';

@Component({
  selector: 'gifs-list',
  imports: [GifsListItemComponent],
  templateUrl: './gifs-list.component.html',
})
export class GifsListComponent {
  gifs = input.required<Gif[]>();
}
