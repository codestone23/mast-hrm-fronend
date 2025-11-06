"use client";

import React from "react";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import newsService from "@/services/news.service";
import { News } from "@/types/api";
import {
    NewsDetailContainer,
    NewsDetailHeader,
    NewsDetailBackButton,
    NewsDetailTitle,
    NewsDetailMeta,
    NewsDetailMetaItem,
    NewsDetailAuthor,
    NewsDetailContent,
    LoadingContainer,
    ErrorContainer,
} from "./newsStyle";
import { format } from "date-fns";
import { vi } from "date-fns/locale/vi";
import { Button, Loading } from "@/components/common";

interface NewsDetailProps {
    newsId: string | number;
}

const NewsDetail: React.FC<NewsDetailProps> = ({ newsId }) => {
    const router = useRouter();

    const { data, isLoading, error } = useQuery({
        queryKey: ["news", newsId],
        queryFn: () => newsService.getNewsById(newsId),
    });

    const news: News | null = data || null;

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "dd/MM/yyyy HH:mm", {
                locale: vi,
            });
        } catch {
            return dateString;
        }
    };

    return (
        <NewsDetailContainer>
            <NewsDetailBackButton onClick={() => router.back()}>
                <ArrowLeft size={18} />
                Quay lại
            </NewsDetailBackButton>
            {isLoading ? (
                <Loading />
            ) : news ? (
                <>
                    <NewsDetailHeader>
                        <NewsDetailTitle>{news.title}</NewsDetailTitle>
                        <NewsDetailMeta>
                            <NewsDetailMetaItem>
                                <Calendar size={16} />
                                <span>{formatDate(news.created_at)}</span>
                            </NewsDetailMetaItem>
                            <NewsDetailAuthor>
                                <User size={16} />
                                <span>
                                    {news.authorName ||
                                        news.author?.user_information?.name ||
                                        "Không xác định"}
                                </span>
                            </NewsDetailAuthor>
                        </NewsDetailMeta>
                    </NewsDetailHeader>
                    <NewsDetailContent
                        dangerouslySetInnerHTML={{ __html: news.content }}
                    />
                </>
            ) : (
                <ErrorContainer>
                    <p>Không tìm thấy tin tức này</p>
                    <Button onClick={() => router.back()}>Quay lại</Button>
                </ErrorContainer>
            )}
        </NewsDetailContainer>
    );
};

export default NewsDetail;
