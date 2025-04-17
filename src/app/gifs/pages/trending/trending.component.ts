import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { GiphyService } from '@/gifs/services/giphy/giphy.service';
import { ScrollStateService } from '@/shared/services/scroll-state.service';
import { GifsListItemComponent } from '@/gifs/components/gifs-list/gifs-list-item/gifs-list-item.component';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  imports: [GifsListItemComponent],
})

class TrendingComponent implements AfterViewInit{

  //dependencies
  giphyService = inject(GiphyService);
  scrollService = inject(ScrollStateService);

  //references
  scrollable = viewChild<ElementRef<HTMLDivElement>>('scrollable');

  //lifecycle hooks
  ngAfterViewInit() {

    const scroll = this.scrollable()?.nativeElement;

    if (!scroll) return;

    scroll.scrollTop = this.scrollService.trendingScrollState();

  }

  //methods
  onScroll() {

    const scroll = this.scrollable()?.nativeElement;

    if (!scroll) return;

    const { scrollTop, scrollHeight, clientHeight } = scroll;

    const isBottom = scrollTop + clientHeight + 200 >= scrollHeight;

    this.scrollService.trendingScrollState.set(scrollTop);

    if (isBottom) {
      this.giphyService.loadTrendingGifs();
    }
  }
}

export default TrendingComponent;
