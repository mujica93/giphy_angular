import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Gif } from '@/gifs/interfaces/gif/gif.interface';
import { GiphyService } from '@/gifs/services/giphy/giphy.service';
import { GifsListComponent } from "@gifs/components/gifs-list/gifs-list.component";

@Component({
  selector: 'app-search',
  imports: [GifsListComponent],
  templateUrl: './search.component.html',
})

class SearchComponent {

  //dependencies
  giphyService = inject(GiphyService);

  //signals
  gifs = signal<Gif[]>([]);

  //html references
  scrollable = viewChild<ElementRef<HTMLDivElement>>('scrollable');

  //methods
  onSearch(query: string) {
    this.giphyService.searchGifs(query)?.subscribe((gifs) => {
      const group = this.masonryGifs(gifs);
      this.gifs.set(group.flat());
    })
  }

  onScroll(query: string) {
    const scroll = this.scrollable()?.nativeElement;

    if (!scroll) return;

    const { scrollTop, scrollHeight, clientHeight } = scroll;

    const isBottom = scrollTop + clientHeight + 200 >= scrollHeight;

    if (isBottom) {
      this.giphyService.searchGifs(query)?.subscribe((gifs) => {
        const group = this.masonryGifs(gifs);
        this.gifs.update((prev) => [...prev, ...group.flat()]);
      })
    }

  }

  masonryGifs(gifs: Gif[]) {
    const group = [];

    for (let i = 0; i < gifs.length; i+=3) {
      group.push(gifs.slice(i, i + 3));
    }

    return group;

  }

}

export default SearchComponent;
