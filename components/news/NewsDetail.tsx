"use client";

import React, { useState } from "react";
import { Calendar, User, ArrowLeft, Share2, Check } from "lucide-react";
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
import { useToast } from "@/hooks/useToast";
import ROUTERS from "@/config/router";

interface NewsDetailProps {
    newsId: string | number;
}

const NewsDetail: React.FC<NewsDetailProps> = ({ newsId }) => {
    const router = useRouter();
    const { success: showSuccessToast } = useToast();
    const [copied, setCopied] = useState(false);

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

    const handleShare = async () => {
        try {
            const currentUrl = window.location.href;
            await navigator.clipboard.writeText(currentUrl);
            setCopied(true);
            showSuccessToast("Đã sao chép link chia sẻ!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = window.location.href;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            showSuccessToast("Đã sao chép link chia sẻ!");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleBack = () => {
        // Check if we're in Company component context
        if (window.location.pathname.includes("/company") || window.location.search.includes("newsId")) {
            router.push(ROUTERS.PERSONAL.COMPANY);
        } else {
            router.back();
        }
    };

    return (
        <NewsDetailContainer>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <NewsDetailBackButton onClick={handleBack}>
                    <ArrowLeft size={18} />
                    Quay lại
                </NewsDetailBackButton>
                {news && (
                    <Button
                        variant="outline"
                        onClick={handleShare}
                        icon={copied ? <Check size={16} /> : <Share2 size={16} />}
                    >
                        {copied ? "Đã sao chép" : "Chia sẻ"}
                    </Button>
                )}
            </div>
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
