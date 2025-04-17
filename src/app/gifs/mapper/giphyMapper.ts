import { GiphyItem } from "@gifs/interfaces/giphy/giphy.interface";
import { Gif } from "@gifs/interfaces/gif/gif.interface";

export class GiphyMapper {

  static mapGiphyItemtoGif(item: GiphyItem): Gif {
    return {
      id: item.id,
      title: item.title,
      url: item.images.original.url,
    }
  }

  static mapGiphyItemsToGifs(items: GiphyItem[]): Gif[] {
    return items.map((item) => this.mapGiphyItemtoGif(item));
  }

}
