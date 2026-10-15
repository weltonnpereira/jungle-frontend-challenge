import * as React from "react";
import { NFT, FilterState, TabCategory, SortOption } from "@/src/types/nft";
import { MOCK_NFTS } from "@/src/mocks/nftData";
import { HeroSection } from "@/src/components/home/HeroSection";
import { FiltersSidebar } from "@/src/components/home/FiltersSidebar";
import { NFTGrid } from "@/src/components/home/NFTGrid";
import { PromoBanners } from "@/src/components/home/PromoBanners";
import { MintingDiary } from "@/src/components/home/MintingDiary";
import { FeaturesNewsletter } from "@/src/components/home/FeaturesNewsletter";
import { MobileFilterSheet } from "@/src/components/home/MobileFilterSheet";

export interface HomeProps {
  /**
   * Optional NFT list passed from TanStack Query or mock API (MSW).
   * If not provided, fallback to internal mock data with active filters.
   */
  nfts?: NFT[];
  isLoading?: boolean;
  heroImage?: string;
  initialFilters?: Partial<FilterState>;
  onFilterChange?: (filters: FilterState) => void;
  onSelectNFT?: (nft: NFT) => void;
  onToggleLike?: (id: string) => void;
  onExploreGenesis?: () => void;
  onExploreCurated?: () => void;
  onReadArticle?: (slug: string) => void;
  /**
   * Search query synced from the Header component
   */
  searchQuery?: string;
  /**
   * Controlled mobile filter sheet state
   */
  isMobileFilterOpen?: boolean;
  setIsMobileFilterOpen?: (open: boolean) => void;
}

export const Home: React.FC<HomeProps> = ({
  nfts: externalNfts,
  isLoading = false,
  heroImage = "/assets/hero-nft.png",
  initialFilters,
  onFilterChange,
  onSelectNFT,
  onToggleLike,
  onExploreGenesis,
  onExploreCurated,
  onReadArticle,

  searchQuery = "",
  isMobileFilterOpen: controlledMobileFilterOpen,
  setIsMobileFilterOpen: controlledSetMobileFilterOpen,
}) => {
  // Filter States - ready to bind to URL (e.g. TanStack Router search params)
  const [search, setSearch] = React.useState(
    initialFilters?.search ?? searchQuery,
  );
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    initialFilters?.category ?? null,
  );
  const [selectedNetwork, setSelectedNetwork] = React.useState<string | null>(
    initialFilters?.network ?? null,
  );
  const [priceRange, setPriceRange] = React.useState<[number, number]>(
    initialFilters?.priceRange ?? [0.02, 12.3],
  );
  const [sortBy, setSortBy] = React.useState<SortOption>(
    initialFilters?.sortBy ?? "recent",
  );
  const [activeTab, setActiveTab] = React.useState<TabCategory>(
    initialFilters?.tab ?? "all",
  );
  const [currentPage, setCurrentPage] = React.useState<number>(
    initialFilters?.page ?? 1,
  );

  // Internal mobile sheet state fallback if not controlled
  const [internalMobileFilterOpen, setInternalMobileFilterOpen] =
    React.useState(false);
  const isSheetOpen =
    controlledMobileFilterOpen !== undefined
      ? controlledMobileFilterOpen
      : internalMobileFilterOpen;
  const handleSheetOpenChange =
    controlledSetMobileFilterOpen ?? setInternalMobileFilterOpen;

  // Sync external search query
  React.useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  // Notify parent of filter state changes (for TanStack Router or Query refetch)
  const notifyFilterChange = React.useCallback(
    (overrides?: Partial<FilterState>) => {
      const state: FilterState = {
        search,
        category: selectedCategory,
        network: selectedNetwork,
        priceRange,
        sortBy,
        tab: activeTab,
        page: currentPage,
        ...overrides,
      };
      onFilterChange?.(state);
    },
    [
      search,
      selectedCategory,
      selectedNetwork,
      priceRange,
      sortBy,
      activeTab,
      currentPage,
      onFilterChange,
    ],
  );

  // Handlers
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    notifyFilterChange({ category, page: 1 });
  };

  const handleNetworkSelect = (network: string | null) => {
    setSelectedNetwork(network);
    setCurrentPage(1);
    notifyFilterChange({ network, page: 1 });
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  const handleApplyPrice = () => {
    setCurrentPage(1);
    notifyFilterChange({ priceRange, page: 1 });
  };

  const handleTabChange = (tab: TabCategory) => {
    setActiveTab(tab);
    setCurrentPage(1);
    notifyFilterChange({ tab, page: 1 });
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    notifyFilterChange({ sortBy: sort });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    notifyFilterChange({ page });
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setSelectedNetwork(null);
    setPriceRange([0.02, 12.3]);
    setSortBy("recent");
    setActiveTab("all");
    setCurrentPage(1);
    notifyFilterChange({
      category: null,
      network: null,
      priceRange: [0.02, 12.3],
      sortBy: "recent",
      tab: "all",
      page: 1,
    });
  };

  // Calculate active filter count
  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (selectedNetwork ? 1 : 0) +
    (priceRange[0] > 0.05 || priceRange[1] < 12.0 ? 1 : 0);

  // Filter & sort logic (used if external nfts prop is not provided or to filter mock data)
  const displayNFTs = React.useMemo(() => {
    const source = externalNfts ?? MOCK_NFTS;

    return source
      .filter((nft) => {
        // Search
        if (search) {
          const q = search.toLowerCase();
          const matchName = nft.name.toLowerCase().includes(q);
          const matchCol = nft.collection.toLowerCase().includes(q);
          if (!matchName && !matchCol) return false;
        }
        // Category
        if (selectedCategory && nft.category !== selectedCategory) {
          return false;
        }
        // Network
        if (selectedNetwork && nft.network !== selectedNetwork) {
          return false;
        }
        // Price Range
        if (nft.price < priceRange[0] || nft.price > priceRange[1]) {
          return false;
        }
        // Tabs
        if (
          activeTab === "new" &&
          !nft.tokenId.includes("4") &&
          !nft.tokenId.includes("8")
        ) {
          // simulation for new releases
        }
        if (activeTab === "trending" && (nft.likes ?? 0) < 150) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.price - b.price;
        if (sortBy === "price_desc") return b.price - a.price;
        if (sortBy === "likes_desc") return (b.likes ?? 0) - (a.likes ?? 0);
        return 0; // default recent
      });
  }, [
    externalNfts,
    search,
    selectedCategory,
    selectedNetwork,
    priceRange,
    activeTab,
    sortBy,
  ]);

  return (
    <div className="w-full bg-[#0D0B0A] text-[#F3E8E2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* 1. Hero Section */}
        <HeroSection
          heroImage={heroImage}
          onExploreClick={() => {
            const catalogEl = document.getElementById("catalogo-nfts");
            catalogEl?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* 2. Main Marketplace Catalog Section */}
        <section id="catalogo-nfts" className="pt-2">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Desktop Filters Sidebar (Left column) */}
            <div className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-28">
              <FiltersSidebar
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
                selectedNetwork={selectedNetwork}
                onSelectNetwork={handleNetworkSelect}
                priceRange={priceRange}
                onPriceRangeChange={handlePriceRangeChange}
                onApplyPrice={handleApplyPrice}
                showFeaturedCard={true}
              />
            </div>

            {/* NFT Grid & Tabs (Right column) */}
            <div id="mercado" className="flex-1 w-full min-w-0">
              <NFTGrid
                nfts={displayNFTs}
                isLoading={isLoading}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                currentPage={currentPage}
                totalPages={4}
                onPageChange={handlePageChange}
                onSelectNFT={onSelectNFT}
                onToggleLike={onToggleLike}
              />
            </div>
          </div>
        </section>

        {/* 3. Promo Banners (Middle cards) */}
        <PromoBanners
          onExploreGenesis={onExploreGenesis}
          onExploreCurated={onExploreCurated}
        />

        {/* 4. Editorial: Diário da Cunhagem */}
        <MintingDiary onReadArticle={onReadArticle} />
      </div>

      {/* Mobile Filters Sheet (Radix / shadcn Sheet) */}
      <MobileFilterSheet
        isOpen={isSheetOpen}
        onOpenChange={handleSheetOpenChange}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        selectedNetwork={selectedNetwork}
        onSelectNetwork={handleNetworkSelect}
        priceRange={priceRange}
        onPriceRangeChange={handlePriceRangeChange}
        onApplyPrice={handleApplyPrice}
        onResetFilters={handleResetFilters}
        activeFiltersCount={activeFiltersCount}
      />
    </div>
  );
};
export default Home;
