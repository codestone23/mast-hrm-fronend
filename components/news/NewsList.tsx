"use client";

import React, { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Search, FileText } from "lucide-react";
import NewsCard from "./NewsCard";
import { Input } from "@/components/common";
import newsService from "@/services/news.service";
import {
  NewsListContainer,
  NewsListHeader,
  NewsListTitle,
  NewsListSubtitle,
  FilterContainer,
  NewsGrid,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  LoadingMore,
  NewsSentinel,
} from "./newsStyle";
import { News, NewsStatus } from "@/types/api";
import { useRouter } from "next/navigation";
import ROUTERS from "@/config/router";

interface NewsListProps {
  status?: NewsStatus;
  showFilters?: boolean;
  onNewsClick?: (news: News) => void;
}

const NewsList: React.FC<NewsListProps> = ({
  status,
  showFilters = true,
  onNewsClick,
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["news", debouncedSearch, status],
    queryFn: ({ pageParam = 1 }) =>
      newsService.getNews(pageParam, 10, debouncedSearch || undefined, status),
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage.pagination?.total_pages || 0;
      const currentPage = lastPage.pagination?.current_page || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const newsList = data?.pages.flatMap((page) => page.data || []) || [];

  // Infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleNewsClick = (news: News) => {
    if (onNewsClick) {
      onNewsClick(news);
    } else {
      router.push(`${ROUTERS.PERSONAL.NEWS}/${news.id}`);
    }
  };

  return (
    <NewsListContainer>
      <NewsListHeader>
        <div>
          <NewsListTitle>Tin tức</NewsListTitle>
          <NewsListSubtitle>
            Tổng cộng: {newsList.length} tin tức
          </NewsListSubtitle>
        </div>
      </NewsListHeader>

      {showFilters && (
        <FilterContainer>
          <Input
            placeholder="Tìm kiếm theo tiêu đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={18} />}
            iconPosition="left"
            size="md"
            fullWidth={true}
          />
        </FilterContainer>
      )}

      {isLoading ? (
        <LoadingMore>Đang tải...</LoadingMore>
      ) : newsList.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <FileText size={48} />
          </EmptyIcon>
          <EmptyTitle>Không có tin tức nào</EmptyTitle>
          <EmptyDescription>
            {debouncedSearch
              ? "Không tìm thấy tin tức nào với từ khóa bạn tìm kiếm"
              : "Chưa có tin tức nào được đăng"}
          </EmptyDescription>
        </EmptyState>
      ) : (
        <>
          <NewsGrid>
            {newsList.map((news) => (
              <NewsCard
                key={news.id}
                news={news}
                onClick={() => handleNewsClick(news)}
              />
            ))}
          </NewsGrid>
          <NewsSentinel ref={sentinelRef} />
          {isFetchingNextPage && (
            <LoadingMore>Đang tải thêm...</LoadingMore>
          )}
        </>
      )}
    </NewsListContainer>
  );
};

export default NewsList;

