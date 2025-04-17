import { map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { GiphyMapper } from '@/gifs/mapper/giphyMapper';
import { Gif } from '@/gifs/interfaces/gif/gif.interface';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { GiphyResponse } from '@gifs/interfaces/giphy/giphy.interface';

const HISTORY_KEY = 'history';

const getGifsLocalStorage = () => {
  const gifsHistory = localStorage.getItem(HISTORY_KEY) ?? '{}'
  const gifs = JSON.parse(gifsHistory);
  return gifs;
};

@Injectable({
  providedIn: 'root'
})

export class GiphyService {

  //dependencies
  http = inject(HttpClient);

  //signals
  trendingGifs = signal<Gif[]>([]);
  trendingLoading = signal<boolean>(false);
  private offsetGifs = signal<number>(0);
  private offsetGifsSearch = signal<number>(0);
  private offsetGifsByKey = signal<number>(0);

  searchHistory = signal<Record<string, Gif[]>>(getGifsLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  masonryGifs = computed(() => {
    const group = [];

    for (let i = 0; i < this.trendingGifs().length; i+=3) {
      group.push(this.trendingGifs().slice(i, i + 3));
    }
    return group;
  });

  constructor() {
    this.loadTrendingGifs();
  }

  saveHistoryOnLocalStorage = effect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(this.searchHistory()));
  });

  /**
    * Load trending gifs from Giphy API
  */

  loadTrendingGifs() {

    if (this.trendingLoading()) return;

    this.trendingLoading.set(true);

    this.http.get<GiphyResponse>(`${environment.giphyApiUrl}/gifs/trending`,{
      params: {
        api_key: environment.giphyApiKey,
        limit: 25,
        offset: this.offsetGifs() * 25
      }
    }).subscribe((response) => {

      const gifs = GiphyMapper.mapGiphyItemsToGifs(response.data);

      this.trendingGifs.update(currentGifs =>[
        ...currentGifs,
        ...gifs
      ]);

      this.offsetGifs.update((offset) => offset + 1);

      this.trendingLoading.set(false);

    })
  }

  /**
    * Search gifs from Giphy API
  */

  searchGifs(query: string) {

    if (this.trendingLoading()) return;

    this.trendingLoading.set(true);

    return this.http.get<GiphyResponse>(`${environment.giphyApiUrl}/gifs/search`,{
      params: {
        api_key: environment.giphyApiKey,
        q: query,
        limit: 25,
        offset: this.offsetGifsSearch() * 25
      }
    }).pipe(
      map(({data}) => data),
      map((item) => GiphyMapper.mapGiphyItemsToGifs(item)),
      tap((items) => {
        this.searchHistory.update((history) => ({
          ...history,
          [query.toLocaleLowerCase()]: items
        }));

        this.offsetGifsSearch.update((offset) => offset + 1);
        this.trendingLoading.set(false);
      })
    );
  }

  /**
    * Get gifs by query from search history
  */

  getGifsByKey(key: string) {

    if (this.offsetGifsByKey() > 0) {

      if (this.trendingLoading()) return;

      this.trendingLoading.set(true);

      return this.http.get<GiphyResponse>(`${environment.giphyApiUrl}/gifs/search`,{
        params: {
          api_key: environment.giphyApiKey,
          q: key,
          limit: 25,
          offset: this.offsetGifsByKey() * 25
        }
      }).pipe(
        map(({data}) => data),
        map((item) => GiphyMapper.mapGiphyItemsToGifs(item)),
        tap((items) => {
          this.searchHistory.update((history) => ({
            ...history,
            [key.toLocaleLowerCase()]: items
          }));

          this.offsetGifsByKey.update((offset) => offset + 1);
          this.trendingLoading.set(false);
        })
      );
    }

    this.trendingLoading.set(false);

    this.offsetGifsByKey.update((offset) => offset + 1);

    return this.searchHistory()[key] || [];
  }
}
