"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, FileText } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import notificationService from "@/services/notification.service";
import { useRouter } from "next/navigation";
import {
  NotificationContainer,
  NotificationDropdownPanel,
  NotificationHeader,
  NotificationTitle,
  NotificationList,
  NotificationItem,
  NotificationItemTitle,
  NotificationItemDescription,
  NotificationItemTime,
  EmptyNotifications,
  LoadingMore,
  NotificationSentinel,
} from "./notificationDropdownStyle";
import { Notification } from "@/types/api";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale/vi";
import ROUTERS from "@/config/router";
import Loading from "../Loading/Loading";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam = 1 }) =>
      notificationService.getNotifications(pageParam, 10),
    getNextPageParam: (lastPage) => {
      const totalPages = lastPage.pagination?.total_pages || 0;
      const currentPage = lastPage.pagination?.current_page || 1;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: isOpen,
  });

  const notifications = data?.pages.flatMap((page) => page.data || []) || [];

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleNotificationClick = (notification: Notification) => {
    onClose();
    if (notification.id_new) {
      router.push(`${ROUTERS.PERSONAL.BASE}/news/${notification.id_new}`);
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: vi,
      });
    } catch {
      return "";
    }
  };

  return (
    <NotificationContainer ref={dropdownRef}>
      <NotificationDropdownPanel $isOpen={isOpen}>
        <NotificationHeader>
          <NotificationTitle>Thông báo</NotificationTitle>
        </NotificationHeader>

        {isLoading ? (
          <Loading />
        ) : notifications.length === 0 ? (
          <EmptyNotifications>
            <Bell size={48} />
            <p>Không có thông báo nào</p>
          </EmptyNotifications>
        ) : (
          <NotificationList>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
              >
                <NotificationItemTitle>
                  {notification.title}
                </NotificationItemTitle>
                <NotificationItemDescription>
                  {notification.description}
                </NotificationItemDescription>
                <NotificationItemTime>
                  {formatTime(notification.created_at)}
                </NotificationItemTime>
              </NotificationItem>
            ))}
            <NotificationSentinel ref={sentinelRef} />
            {isFetchingNextPage && <Loading />}
          </NotificationList>
        )}
      </NotificationDropdownPanel>
    </NotificationContainer>
  );
};

export default NotificationDropdown;

