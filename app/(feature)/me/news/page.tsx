"use client";

import NewsList from "@/components/news/NewsList";
import { NewsStatus } from "@/types/api";

export default function NewsPage() {
  return <NewsList status={NewsStatus.APPROVED} />;
}

