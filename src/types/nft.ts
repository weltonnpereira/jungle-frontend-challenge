export interface NFT {
  id: string;
  name: string;
  tokenId: string;
  price: number;
  originalPrice?: number;
  currency: 'ETH' | 'SOL' | 'MATIC';
  image: string;
  rarity?: 'Comum' | 'Raro' | 'Lendário' | 'Mítico';
  likes?: number;
  collection: string;
  network: 'Ethereum' | 'Polygon' | 'Solana';
  category: string;
  isFeatured?: boolean;
  creator?: {
    name: string;
    avatar?: string;
    verified?: boolean;
  };
}

export type SortOption =
  | 'recent'
  | 'price_asc'
  | 'price_desc'
  | 'likes_desc'
  | 'rarity';

export type TabCategory = 'all' | 'new' | 'trending';

export interface FilterState {
  search: string;
  category: string | null;
  priceRange: [number, number];
  network: string | null;
  sortBy: SortOption;
  tab: TabCategory;
  page: number;
}

export interface CollectionCount {
  name: string;
  count: number;
  slug: string;
}

export interface NetworkCount {
  name: string;
  count: number;
  slug: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
}
