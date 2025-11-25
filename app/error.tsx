"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ROUTERS from "@/config/router";
import styled from "styled-components";

const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  font-family: system-ui, sans-serif;
`;

const ErrorTitle = styled.h1`
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #ef4444;
`;

const ErrorDescription = styled.p`
    font-size: 1.125rem;
    margin-bottom: 2rem;
    color: #6b7280;
`;

const ErrorButton = styled.button`
    padding: 0.75rem 1.5rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
`;

const ErrorButtons = styled.div`
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
`;

const ErrorDetails = styled.details`
    margin-top: 2rem;
    text-align: left;
    max-width: 600px;
`;

const ErrorDetailSummary = styled.summary`
    cursor: pointer;
    color: #6b7280;
`;

const ErrorDetailContentText = styled.pre`
    font-size: 0.875rem;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-word;
`;

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        // Log error to console
        console.error("Error occurred:", error);
    }, [error]);

    const handleGoHome = () => {
        router.push(ROUTERS.OVERVIEW.BASE);
    };

    const handleRetry = () => {
        reset();
    };

    return (
        <ErrorContainer>
            <ErrorTitle>Đã xảy ra lỗi</ErrorTitle>
            <ErrorDescription>
                Có lỗi không mong muốn đã xảy ra. Vui lòng thử lại.
            </ErrorDescription>
            <ErrorButtons>
                <ErrorButton onClick={handleRetry}>Thử lại</ErrorButton>
                <ErrorButton onClick={handleGoHome}>Về trang chủ</ErrorButton>
            </ErrorButtons>

            {process.env.NODE_ENV === "development" && (
                <ErrorDetails>
                    <ErrorDetailSummary>
                        Chi tiết lỗi (chỉ hiển thị trong development)
                    </ErrorDetailSummary>
                    <ErrorDetailContentText>
                        {error.message}
                    </ErrorDetailContentText>
                </ErrorDetails>
            )}
        </ErrorContainer>
    );
}
