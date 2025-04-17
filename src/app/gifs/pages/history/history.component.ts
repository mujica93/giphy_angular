import { Component, inject, signal, viewChild, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { GiphyService } from '@/gifs/services/giphy/giphy.service';
import { GifsListComponent } from "@gifs/components/gifs-list/gifs-list.component";
import { Gif } from '@/gifs/interfaces/gif/gif.interface';

@Component({
  selector: 'gif-history',
  imports: [GifsListComponent],
  templateUrl: './history.component.html',
})

class HistoryComponent implements OnInit {

  //signal
  gifsKey = signal<Gif[]>([])

  //dependencies
  query = toSignal(
    inject(ActivatedRoute).params
    .pipe(
      map((params) => params['query'])
    )
  );

  giphyService = inject(GiphyService);

  //html references
  scrollable = viewChild<ElementRef<HTMLDivElement>>('scrollable');

  ngOnInit(){

    const gifsOrObservable = this.giphyService.getGifsByKey(this.query());

    if (Array.isArray(gifsOrObservable)) {
      this.gifsKey.set(this.masonryGifs(gifsOrObservable).flat());
    } else {
      gifsOrObservable?.subscribe((gifs) => {
        this.gifsKey.set(this.masonryGifs(gifs).flat());
      });
    }
  }

  onScroll() {

    const scroll = this.scrollable()?.nativeElement;

    if (!scroll) return;

    const { scrollTop, scrollHeight, clientHeight } = scroll;

    const isBottom = scrollTop + clientHeight + 200 >= scrollHeight;

    if (isBottom) {

      const gifsOrObservable = this.giphyService.getGifsByKey(this.query());

      if (Array.isArray(gifsOrObservable)) {
        this.gifsKey.update((prev) => [...prev, ...this.masonryGifs(gifsOrObservable).flat()]);
      } else {
        gifsOrObservable?.subscribe((gifs) => {
          this.gifsKey.update((prev) => [...prev, ...this.masonryGifs(gifs).flat()]);
        });
      }
    }


  }

  masonryGifs(gifs: Gif[]) {
    const group = [];

    for (let i = 0; i < gifs.length; i += 3) {
      group.push(gifs.slice(i, i + 3));
    }

    return group;
  }
}

export default HistoryComponent;
