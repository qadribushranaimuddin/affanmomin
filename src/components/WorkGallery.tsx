import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Download, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon, 
  Eye, 
  Grid, 
  Sliders, 
  ZoomIn, 
  ZoomOut,
  Infinity as InfinityIcon,
  Square
} from "lucide-react";

interface GalleryItem {
  id: string;
  category: "Packaging" | "Banners & Posters" | "Pamphlets" | "Logos";
  title: string;
  src: string;
  alt: string;
}

const GALLERY_ITEMS: GalleryItem[] = [];

// 1. Burraq Herbal Packaging (7 items)
for (let i = 1; i <= 7; i++) {
  GALLERY_ITEMS.push({
    id: `burraq-${i}`,
    category: "Packaging",
    title: `Burraq Herbal Bottle Label #${i}`,
    src: `/Assets/Burraq/1 (${i}).jpeg`,
    alt: `Burraq Herbal medicine container print layout #${i}`
  });
}

// 2. Chawla Remedies Packaging (13 items)
for (let i = 1; i <= 13; i++) {
  GALLERY_ITEMS.push({
    id: `chawla-${i}`,
    category: "Packaging",
    title: `Chawla Remedies tablet box #${i}`,
    src: `/Assets/Chawla/2 (${i}).jpeg`,
    alt: `Chawla Remedies pharmaceutical packing layout #${i}`
  });
}

// 3. Packaging design (24 items)
for (let i = 1; i <= 24; i++) {
  GALLERY_ITEMS.push({
    id: `packaging-${i}`,
    category: "Packaging",
    title: `Commercial Folding Carton Layout #${i}`,
    src: `/Assets/Packaging design/3 (${i}).jpeg`,
    alt: `Commercial product box custom fold template #${i}`
  });
}

// 4. Pamphlet Design (10 items)
for (let i = 1; i <= 10; i++) {
  GALLERY_ITEMS.push({
    id: `pamphlet-${i}`,
    category: "Pamphlets",
    title: `Double-sided Advertising Pamphlet #${i}`,
    src: `/Assets/Pamphlet Design/4 (${i}).jpeg`,
    alt: `Tactile promo pamphlet brochure design #${i}`
  });
}

// 5. Banner & poster (20 items)
for (let i = 1; i <= 20; i++) {
  GALLERY_ITEMS.push({
    id: `banner-${i}`,
    category: "Banners & Posters",
    title: `Shop Front Flex Billboard #${i}`,
    src: `/Assets/Banner & poster/5 (${i}).jpeg`,
    alt: `High resolution large outdoor banner poster #${i}`
  });
}

// 6. Logo design (5 items)
for (let i = 1; i <= 5; i++) {
  GALLERY_ITEMS.push({
    id: `logo-${i}`,
    category: "Logos",
    title: `Vector Graphic Identity Stamp #${i}`,
    src: `/Assets/logo design/6 (${i}).jpeg`,
    alt: `CorelDRAW precise corporate logo guidelines #${i}`
  });
}

export default function WorkGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "carousel" | "marquee" | "single">("marquee");
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const getLoopingRow = (items: GalleryItem[]) => {
    if (items.length === 0) return [];
    let list = [...items];
    while (list.length < 10) {
      list = [...list, ...items];
    }
    return [...list, ...list];
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const categories = ["All", "Packaging", "Banners & Posters", "Pamphlets", "Logos"];

  const filteredItems = selectedCategory === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === selectedCategory);

  const displayedItems = filteredItems.slice(0, visibleCount);

  // Reset carousel index and visible items count when switching categories
  useEffect(() => {
    setCarouselIndex(0);
    setVisibleCount(12);
  }, [selectedCategory]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsZoomed(false);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setIsZoomed(false);
  };

  const nextSlide = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    setIsZoomed(false);
  };

  const prevSlide = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    setIsZoomed(false);
  };

  return (
    <div className="py-8 border-b border-[#222]/80" id="gallery-section">
      {/* Section Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-10 gap-6">
        <div className="relative w-full xl:w-auto">
          <span className="text-xs font-mono uppercase text-[#FF3E00] tracking-widest font-bold block mb-1">
            // Image Board Matrix
          </span>
          <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">
            Real Design Print Archives
          </h2>
          
          {/* Calibrated Lock-On Line */}
          <div className="relative w-full pt-4 pb-1 overflow-hidden pointer-events-none select-none">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-[1px] w-full bg-gradient-to-r from-[#FF3E00] via-card-border to-transparent origin-left border-t border-dashed border-[#FF3E00]/30"
            />
            <div className="absolute right-0 top-1.5 flex items-center space-x-1.5 font-mono text-[8px] text-[#A3A3A3] opacity-80">
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.7 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                SEC_GAL_04
              </motion.span>
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="w-1.5 h-1.5 bg-[#FF3E00]"
              />
            </div>
          </div>

          <p className="text-sm text-[#737373] mt-2.5 max-w-xl">
            Browse through a massive library of {GALLERY_ITEMS.length} original layout templates from corporate brands, packaging boxes, outdoor banners, and logo vectors.
          </p>
        </div>

        {/* Toolbar (Filters & Layout Switcher) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 xl:justify-end">
          {/* Categories filters */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded-lg backdrop-blur-md">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-mono uppercase rounded-md transition-all relative cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "text-black font-extrabold font-black border border-transparent"
                    : "text-[#A3A3A3] hover:text-white border border-transparent"
                }`}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  {cat}
                </span>
                {selectedCategory === cat && (
                  <motion.span
                    layoutId="activeGalleryFilter"
                    className="absolute inset-0 bg-[#FF3E00] rounded-md z-0"
                    transition={{ type: "spring", stiffness: 220, damping: 22 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* View Switcher */}
          <div className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/5 rounded-lg backdrop-blur-md">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md cursor-pointer transition-all ${
                viewMode === "grid" 
                  ? "bg-white/10 text-[#FF3E00] shadow-sm" 
                  : "text-[#737373] hover:text-[#A3A3A3]"
              }`}
              title="Grid Layout"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("carousel")}
              className={`p-1.5 rounded-md cursor-pointer transition-all ${
                viewMode === "carousel" 
                  ? "bg-white/10 text-[#FF3E00] shadow-sm" 
                  : "text-[#737373] hover:text-[#A3A3A3]"
              }`}
              title="3D Card Carousel"
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("marquee")}
              className={`p-1.5 rounded-md cursor-pointer transition-all ${
                viewMode === "marquee" 
                  ? "bg-white/10 text-[#FF3E00] shadow-sm" 
                  : "text-[#737373] hover:text-[#A3A3A3]"
              }`}
              title="Infinite Alternate Marquee"
            >
              <InfinityIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("single")}
              className={`p-1.5 rounded-md cursor-pointer transition-all ${
                viewMode === "single" 
                  ? "bg-white/10 text-[#FF3E00] shadow-sm" 
                  : "text-[#737373] hover:text-[#A3A3A3]"
              }`}
              title="Single Image View"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Board Layout Mode Router */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" && (
          /* Grid View Mode */
          <div className="max-h-[580px] md:max-h-[680px] overflow-y-auto pr-3 custom-gallery-scrollbar relative border border-white/5 rounded-2xl p-4 bg-white/[0.01]">
            <motion.div
              key="grid-layout"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {displayedItems.map((item, index) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                  whileHover={{ y: -5 }}
                  className="group relative bg-[#11]/20 border border-white/5 overflow-hidden cursor-pointer aspect-square rounded-xl backdrop-blur-sm transition-all duration-300 hover:border-[#FF3E00]/30 hover:shadow-[0_0_20px_rgba(255,62,0,0.1)]"
                  onClick={() => openLightbox(index)}
                >
                  <div className="relative w-full h-full overflow-hidden bg-white/[0.01]">
                    {!loadedImages[item.id] && (
                      <div className="absolute inset-0 bg-white/[0.02] flex items-center justify-center animate-pulse">
                        <div className="w-5 h-5 rounded-full border border-white/10 border-t-[#FF3E00] animate-spin" />
                      </div>
                    )}
                    <img
                      src={item.src}
                      alt={item.alt}
                      loading={index < 8 ? "eager" : "lazy"}
                      onLoad={() => setLoadedImages(prev => ({ ...prev, [item.id]: true }))}
                      className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-102 ${
                        loadedImages[item.id] ? "opacity-100 scale-100" : "opacity-0 scale-95"
                      }`}
                    />
                  </div>
                  
                  {/* Dynamic glass overlay on hover */}
                  <div className="absolute inset-0 bg-black/75 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4.5">
                    <div className="flex justify-between items-start font-mono text-[8px] text-[#FF3E00] uppercase font-bold">
                      <span>PLATE APPROVED</span>
                      <span>{item.category}</span>
                    </div>
                    
                    <div className="text-center my-auto flex flex-col items-center gap-2">
                      <div className="w-9 h-9 rounded-full border border-[#FF3E00]/40 flex items-center justify-center text-[#FF3E00] bg-black/60 shadow-[0_0_12px_rgba(255,62,0,0.25)] group-hover:border-[#FF3E00] transition-colors">
                        <Eye className="w-4 h-4" />
                      </div>
                      <span className="font-sans text-xs font-bold text-white uppercase tracking-tight leading-tight px-1 max-w-full truncate">
                        {item.title}
                      </span>
                    </div>

                    <div className="border-t border-white/5 pt-2 flex justify-between items-center font-mono text-[7px] text-[#737373]">
                      <span>SCALE: 100% OK</span>
                      <span>#RAW_OUT</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {viewMode === "carousel" && (
          /* Premium 3D Card Carousel Mode */
          <motion.div
            key="carousel-layout"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center"
          >
            {/* 3D Stack container */}
            <motion.div 
              className="relative w-full overflow-visible flex items-center justify-center h-[380px] md:h-[450px] cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(e, info) => {
                const threshold = 55;
                if (info.offset.x < -threshold) {
                  setCarouselIndex(prev => (prev + 1) % filteredItems.length);
                } else if (info.offset.x > threshold) {
                  setCarouselIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
                }
              }}
            >
              <AnimatePresence initial={false}>
                {filteredItems.map((item, index) => {
                  const offset = index - carouselIndex;
                  if (Math.abs(offset) > 2) return null;
                  
                  const isActive = offset === 0;
                  const absOffset = Math.abs(offset);
                  const isMobile = windowWidth < 768;
                  const spacing = isMobile ? 140 : 260;

                  return (
                    <motion.div
                      key={item.id}
                      style={{
                        position: "absolute",
                        zIndex: 10 - absOffset,
                        transformOrigin: "center center",
                      }}
                      initial={{ opacity: 0, scale: 0.7, x: offset * spacing }}
                      animate={{
                        opacity: isActive ? 1 : 0.4 / absOffset,
                        scale: isActive ? 1 : 0.8 - absOffset * 0.05,
                        x: offset * spacing,
                        rotateY: offset * -18,
                        z: isActive ? 0 : -80,
                      }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      className={`w-[230px] md:w-[310px] aspect-[3/4] rounded-2xl overflow-hidden border transition-all duration-300 ${
                        isActive 
                          ? "border-[#FF3E00] shadow-[0_0_35px_rgba(255,62,0,0.3)] bg-black/60" 
                          : "border-white/5 bg-[#11]/40 backdrop-blur-md"
                      }`}
                      onClick={() => {
                        if (isActive) {
                          openLightbox(index);
                        } else {
                          setCarouselIndex(index);
                        }
                      }}
                    >
                      <div className="relative w-full h-full group flex flex-col justify-between">
                        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-white/[0.01]">
                          {!loadedImages[item.id] && (
                            <div className="absolute inset-0 bg-white/[0.02] flex items-center justify-center animate-pulse">
                              <div className="w-5 h-5 rounded-full border border-white/10 border-t-[#FF3E00] animate-spin" />
                            </div>
                          )}
                          <img 
                            src={item.src} 
                            alt={item.alt}
                            onLoad={() => setLoadedImages(prev => ({ ...prev, [item.id]: true }))}
                            className={`w-full h-full object-cover select-none absolute inset-0 z-0 transition-all duration-700 ease-out ${
                              loadedImages[item.id] ? "opacity-100 scale-100" : "opacity-0 scale-95"
                            }`} 
                          />
                        </div>
                        {/* Hover elements / gradient overlays */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 z-10 flex flex-col justify-between p-4.5 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                          <div className="flex justify-between items-center font-mono text-[7px] text-white/50 tracking-wider">
                            <span>#{item.id.toUpperCase()}</span>
                            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase text-[#FF3E00]">
                              {item.category}
                            </span>
                          </div>

                          {isActive && (
                            <div className="text-center flex flex-col items-center gap-1.5 pt-12">
                              <span className="font-mono text-[7px] uppercase tracking-widest text-[#FF3E00]">Click card to inspect</span>
                              <h4 className="text-sm font-bold text-white tracking-tight uppercase leading-tight line-clamp-2 px-1">
                                {item.title}
                              </h4>
                            </div>
                          )}

                          <div className="flex justify-between items-center font-mono text-[6px] text-white/40">
                            <span>GRID MATRIX v2</span>
                            <span>PRESS STAGE</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Slider Controls */}
            <div className="flex justify-center items-center gap-5 mt-4 z-10">
              <button 
                onClick={() => setCarouselIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length)}
                className="p-2.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md text-white/80 hover:text-[#FF3E00] hover:border-[#FF3E00]/30 transition-all cursor-pointer shadow-lg"
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs text-[#A3A3A3]">
                {carouselIndex + 1} / {filteredItems.length}
              </span>
              <button 
                onClick={() => setCarouselIndex(prev => (prev + 1) % filteredItems.length)}
                className="p-2.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md text-white/80 hover:text-[#FF3E00] hover:border-[#FF3E00]/30 transition-all cursor-pointer shadow-lg"
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Track Centered on Active */}
            <div className="flex items-center justify-center gap-2 mt-6 max-w-full overflow-hidden px-4 py-2 border-t border-white/5 w-full max-w-lg">
              {filteredItems.map((item, index) => {
                const distance = Math.abs(index - carouselIndex);
                if (distance > 3) return null;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCarouselIndex(index)}
                    className={`w-11 h-11 rounded-lg border transition-all overflow-hidden shrink-0 cursor-pointer ${
                      index === carouselIndex 
                        ? "border-[#FF3E00] scale-110 shadow-[0_0_10px_rgba(255,62,0,0.3)]" 
                        : "border-white/5 opacity-30 hover:opacity-75"
                    }`}
                  >
                    <img src={item.src} className="w-full h-full object-cover pointer-events-none" alt="" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {viewMode === "marquee" && (
          /* Alternating Infinite Scrolling Marquee Rows Mode */
          <motion.div
            key="marquee-layout"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6 w-full py-4 relative overflow-hidden"
          >
            {/* Fade Gradients Overlay */}
            <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, var(--app-bg) 0%, transparent 100%)' }} />
            <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, var(--app-bg) 0%, transparent 100%)' }} />

            {/* Row 1: Right to Left */}
            <div className="overflow-hidden w-full select-none py-1">
              <div className="flex gap-4 animate-marquee">
                {getLoopingRow(filteredItems.filter((_, idx) => idx % 3 === 0)).map((item, index) => {
                  const itemIndex = filteredItems.findIndex(fi => fi.id === item.id);
                  return (
                    <div
                      key={`r1-${item.id}-${index}`}
                      onClick={() => openLightbox(itemIndex !== -1 ? itemIndex : 0)}
                      className="w-[160px] md:w-[220px] aspect-square shrink-0 rounded-xl overflow-hidden border border-white/5 hover:border-[#FF3E00]/40 transition-all duration-300 hover:scale-[1.03] cursor-pointer relative group"
                    >
                      <div className="relative w-full h-full overflow-hidden bg-white/[0.01]">
                        {!loadedImages[item.id] && (
                          <div className="absolute inset-0 bg-white/[0.02] flex items-center justify-center animate-pulse">
                            <div className="w-4 h-4 rounded-full border border-white/10 border-t-[#FF3E00] animate-spin" />
                          </div>
                        )}
                        <img 
                          src={item.src} 
                          alt={item.alt} 
                          loading="lazy"
                          onLoad={() => setLoadedImages(prev => ({ ...prev, [item.id]: true }))}
                          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                            loadedImages[item.id] ? "opacity-100 scale-100" : "opacity-0 scale-95"
                          }`}
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Eye className="w-5 h-5 text-[#FF3E00]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Row 2: Left to Right */}
            <div className="overflow-hidden w-full select-none py-1">
              <div className="flex gap-4 animate-marquee-reverse">
                {getLoopingRow(filteredItems.filter((_, idx) => idx % 3 === 1)).map((item, index) => {
                  const itemIndex = filteredItems.findIndex(fi => fi.id === item.id);
                  return (
                    <div
                      key={`r2-${item.id}-${index}`}
                      onClick={() => openLightbox(itemIndex !== -1 ? itemIndex : 0)}
                      className="w-[160px] md:w-[220px] aspect-square shrink-0 rounded-xl overflow-hidden border border-white/5 hover:border-[#FF3E00]/40 transition-all duration-300 hover:scale-[1.03] cursor-pointer relative group"
                    >
                      <div className="relative w-full h-full overflow-hidden bg-white/[0.01]">
                        {!loadedImages[item.id] && (
                          <div className="absolute inset-0 bg-white/[0.02] flex items-center justify-center animate-pulse">
                            <div className="w-4 h-4 rounded-full border border-white/10 border-t-[#FF3E00] animate-spin" />
                          </div>
                        )}
                        <img 
                          src={item.src} 
                          alt={item.alt} 
                          loading="lazy"
                          onLoad={() => setLoadedImages(prev => ({ ...prev, [item.id]: true }))}
                          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                            loadedImages[item.id] ? "opacity-100 scale-100" : "opacity-0 scale-95"
                          }`}
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Eye className="w-5 h-5 text-[#FF3E00]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Row 3: Right to Left */}
            <div className="overflow-hidden w-full select-none py-1">
              <div className="flex gap-4 animate-marquee">
                {getLoopingRow(filteredItems.filter((_, idx) => idx % 3 === 2)).map((item, index) => {
                  const itemIndex = filteredItems.findIndex(fi => fi.id === item.id);
                  return (
                    <div
                      key={`r3-${item.id}-${index}`}
                      onClick={() => openLightbox(itemIndex !== -1 ? itemIndex : 0)}
                      className="w-[160px] md:w-[220px] aspect-square shrink-0 rounded-xl overflow-hidden border border-white/5 hover:border-[#FF3E00]/40 transition-all duration-300 hover:scale-[1.03] cursor-pointer relative group"
                    >
                      <div className="relative w-full h-full overflow-hidden bg-white/[0.01]">
                        {!loadedImages[item.id] && (
                          <div className="absolute inset-0 bg-white/[0.02] flex items-center justify-center animate-pulse">
                            <div className="w-4 h-4 rounded-full border border-white/10 border-t-[#FF3E00] animate-spin" />
                          </div>
                        )}
                        <img 
                          src={item.src} 
                          alt={item.alt} 
                          loading="lazy"
                          onLoad={() => setLoadedImages(prev => ({ ...prev, [item.id]: true }))}
                          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                            loadedImages[item.id] ? "opacity-100 scale-100" : "opacity-0 scale-95"
                          }`}
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Eye className="w-5 h-5 text-[#FF3E00]" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {viewMode === "single" && (
          /* Single Image View Mode */
          <motion.div
            key="single-layout"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center bg-white/[0.01] border border-white/5 rounded-2xl p-6 relative min-h-[400px]"
          >
            {/* Main Single Display Area */}
            <div className="w-full flex items-center justify-between relative max-w-2xl">
              {/* Prev Button */}
              <button
                onClick={() => setCarouselIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length)}
                className="absolute -left-4 md:-left-16 z-20 p-2.5 bg-black/40 border border-white/5 hover:border-[#FF3E00] text-[#A3A3A3] hover:text-[#FF3E00] rounded-full transition-all backdrop-blur-md cursor-pointer shadow-lg"
                title="Previous Image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Main Image Card with Spec Info overlay on hover */}
              <div 
                onClick={() => openLightbox(carouselIndex)}
                className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/10 relative group cursor-pointer bg-black/60 shadow-2xl"
              >
                {filteredItems[carouselIndex] && (
                  <div className="relative w-full h-full overflow-hidden bg-white/[0.01]">
                    {!loadedImages[filteredItems[carouselIndex].id] && (
                      <div className="absolute inset-0 bg-white/[0.02] flex items-center justify-center animate-pulse z-20">
                        <div className="w-6 h-6 rounded-full border border-white/10 border-t-[#FF3E00] animate-spin" />
                      </div>
                    )}
                    <img
                      src={filteredItems[carouselIndex].src}
                      alt={filteredItems[carouselIndex].alt}
                      loading="eager"
                      onLoad={() => setLoadedImages(prev => ({ ...prev, [filteredItems[carouselIndex].id]: true }))}
                      className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-102 ${
                        loadedImages[filteredItems[carouselIndex].id] ? "opacity-100 scale-100" : "opacity-0 scale-95"
                      }`}
                    />

                    {/* Hover Specs Overlay */}
                    <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 z-10">
                      <div className="flex justify-between items-start font-mono text-[8px] text-[#FF3E00] uppercase font-bold">
                        <span>PLATE APPROVED</span>
                        <span>{filteredItems[carouselIndex].category}</span>
                      </div>

                      <div className="text-center my-auto flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full border border-[#FF3E00]/40 flex items-center justify-center text-[#FF3E00] bg-black/60 shadow-[0_0_12px_rgba(255,62,0,0.25)] group-hover:border-[#FF3E00] transition-colors">
                          <Eye className="w-5 h-5" />
                        </div>
                        <span className="font-sans text-sm font-bold text-white uppercase tracking-tight leading-tight px-2 max-w-full truncate">
                          {filteredItems[carouselIndex].title}
                        </span>
                      </div>

                      <div className="border-t border-white/5 pt-2 flex justify-between items-center font-mono text-[8px] text-[#737373]">
                        <span>SCALE: 100% OK</span>
                        <span>CLICK TO INSPECT</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCarouselIndex(prev => (prev + 1) % filteredItems.length)}
                className="absolute -right-4 md:-right-16 z-20 p-2.5 bg-black/40 border border-white/5 hover:border-[#FF3E00] text-[#A3A3A3] hover:text-[#FF3E00] rounded-full transition-all backdrop-blur-md cursor-pointer shadow-lg"
                title="Next Image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Slider Controls / Counter */}
            <div className="flex items-center justify-center gap-2.5 mt-6 font-mono text-xs text-[#A3A3A3]">
              <span>SPECIFICATION</span>
              <span className="text-white font-bold">{carouselIndex + 1}</span>
              <span>OF</span>
              <span className="text-white font-bold">{filteredItems.length}</span>
            </div>

            {/* Thumbnail Navigation track */}
            <div className="flex items-center justify-center gap-2 mt-4 max-w-full overflow-hidden px-4 py-2 border-t border-white/5 w-full max-w-lg">
              {filteredItems.map((item, index) => {
                const distance = Math.abs(index - carouselIndex);
                if (distance > 3) return null;
                return (
                  <button
                    key={`single-thumb-${item.id}`}
                    onClick={() => setCarouselIndex(index)}
                    className={`w-11 h-11 rounded-lg border transition-all overflow-hidden shrink-0 cursor-pointer ${
                      index === carouselIndex 
                        ? "border-[#FF3E00] scale-110 shadow-[0_0_10px_rgba(255,62,0,0.3)]" 
                        : "border-white/5 opacity-30 hover:opacity-75"
                    }`}
                  >
                    <img src={item.src} className="w-full h-full object-cover pointer-events-none" alt="" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load More Trigger (Grid mode only) */}
      {viewMode === "grid" && filteredItems.length > visibleCount && (
        <div className="mt-10 text-center">
          <div className="relative inline-flex p-[1.5px] rounded-lg overflow-hidden bg-white/5 shadow-lg group">
            {/* Continuous loop border animation */}
            <div className="absolute inset-[-1000%] animate-border-loop bg-[conic-gradient(from_0deg,#FF3E00_0%,#FFA200_25%,#FF3E00_50%,#FFA200_75%,#FF3E00_100%)] opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
            
            <button
              onClick={handleLoadMore}
              className="relative px-6 py-3 bg-brand-bg hover:bg-brand-bg/90 text-brand-text hover:text-[#FF3E00] font-mono text-xs uppercase tracking-wider rounded-[7px] cursor-pointer transition-all duration-300 z-10"
            >
              Load More Layouts ({filteredItems.length - visibleCount} Left)
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 bg-[#060606]/96 backdrop-blur-xl flex flex-col justify-center items-center p-4 md:p-8 cursor-zoom-out theme-dark"
            style={{ zIndex: 9000 }}
          >
            {/* Floating Glass Header (Left-aligned to prevent overlap with X button) */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute top-4 left-4 md:top-6 md:left-6 z-10 w-[70%] sm:w-auto backdrop-blur-md bg-black/55 border border-white/10 rounded-full py-2 px-6 flex justify-between items-center shadow-[0_8px_32px_rgba(0,0,0,0.6)] gap-4"
            >
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-[#FF3E00] animate-pulse"></span>
                <span className="uppercase text-white/90 hidden sm:inline">
                  INSPECTOR // SPEC {lightboxIndex + 1} OF {filteredItems.length}
                </span>
                <span className="uppercase text-white/90 sm:hidden">
                  SPEC {lightboxIndex + 1}/{filteredItems.length}
                </span>
              </div>
              
              <div className="flex items-center gap-3 border-l border-white/10 pl-3">
                <button
                  onClick={() => setIsZoomed(prev => !prev)}
                  className="flex items-center gap-1.5 hover:text-[#FF3E00] text-[#A3A3A3] transition-colors uppercase font-bold font-mono text-xs cursor-pointer"
                  title="Toggle Zoom"
                >
                  {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                  <span className="hidden sm:inline">{isZoomed ? "Actual" : "Zoom"}</span>
                </button>
                <a
                  href={filteredItems[lightboxIndex].src}
                  download={filteredItems[lightboxIndex].src.split("/").pop()}
                  className="flex items-center gap-1.5 hover:text-[#FF3E00] text-[#A3A3A3] transition-colors uppercase font-bold font-mono text-xs"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </a>
              </div>
            </div>
 
            {/* Slider View Area */}
            <div 
              className="w-full h-full flex items-center justify-between relative max-w-none"
            >
              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="absolute left-2 md:left-4 z-20 p-2.5 md:p-3 bg-black/40 border border-white/5 hover:border-[#FF3E00] text-[#A3A3A3] hover:text-[#FF3E00] rounded-full transition-all backdrop-blur-md cursor-pointer shadow-lg"
                aria-label="Previous layout"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
 
              {/* Main Image Frame */}
              <div className="w-full h-full flex items-center justify-center overflow-auto p-4 md:p-16">
                <motion.div
                  key={filteredItems[lightboxIndex].id}
                  className="flex items-center justify-center relative min-h-[200px] min-w-[200px]"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.22 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={filteredItems[lightboxIndex].src}
                    alt={filteredItems[lightboxIndex].alt}
                    className={`rounded-lg shadow-[0_24px_60px_rgba(0,0,0,0.85)] border border-white/5 bg-[#080808] transition-all duration-300 ${
                      isZoomed 
                        ? "max-w-[95vw] max-h-[92vh] object-contain cursor-zoom-out" 
                        : "max-w-[85vw] md:max-w-[75vw] max-h-[78vh] object-contain cursor-zoom-in"
                    } opacity-100 scale-100`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsZoomed(prev => !prev);
                    }}
                  />

                  {/* Simple Close button (X icon) at the upper right edge of the image */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeLightbox();
                    }}
                    className="absolute -top-3 -right-3 md:-top-4 md:-right-4 z-30 p-2.5 rounded-full border-2 border-white/30 bg-black/90 hover:bg-[#FF3E00] hover:text-white hover:border-[#FF3E00] text-[#FF3E00] hover:scale-105 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)] cursor-pointer flex items-center justify-center"
                    title="Close"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </motion.div>
              </div>
 
              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="absolute right-2 md:right-4 z-20 p-2.5 md:p-3 bg-black/40 border border-white/5 hover:border-[#FF3E00] text-[#A3A3A3] hover:text-[#FF3E00] rounded-full transition-all backdrop-blur-md cursor-pointer shadow-lg"
                aria-label="Next layout"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
 
            {/* Floating Glass Footer Spec Sheet */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[92%] max-w-5xl backdrop-blur-md bg-black/55 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center shadow-[0_8px_32px_rgba(0,0,0,0.6)] gap-3"
            >
              <div className="text-center sm:text-left">
                <span className="text-[10px] text-[#FF3E00] font-extrabold tracking-wider block mb-0.5">
                  // {filteredItems[lightboxIndex].title.toUpperCase()}
                </span>
                <span className="font-mono text-[9px] text-[#737373]">
                  Category: {filteredItems[lightboxIndex].category} • Sizing: Calibrated 300 DPI layout
                </span>
              </div>
              <div className="text-center sm:text-right font-mono text-[8px] text-[#737373] flex flex-col leading-tight border-t border-white/5 sm:border-t-0 pt-2 sm:pt-0">
                <span>PATH: {filteredItems[lightboxIndex].src}</span>
                <span>STATUS: PRESS READY // ARCHIVED OK</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
