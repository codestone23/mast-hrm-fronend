"use client";

import React from "react";
import Header from "@/components/header/Header";
import ModuleGrid from "../../../components/header/module-grid/ModuleGrid";
import { ContentHeader, PageContainer } from "./overviewStyle";
import { useRouter } from "next/navigation";
import { useOverview } from "./useOverview";

interface UserInfoWithRole {
    role?: {
        name: string;
    };
}

const OverviewPage: React.FC = () => {
    const router = useRouter();
    const { data, isLoading } = useOverview();

    const getUserRole = () => {
        if (!data?.user_information) return undefined;
        const userInfo = data.user_information as UserInfoWithRole;
        return userInfo?.role?.name;
    };

    const handleModuleClick = (modulePath: string) => {
        router.push(modulePath);
    };

    return (
        <PageContainer>
            <Header userName={data?.user_information?.name ?? ""} />
            <ContentHeader>
                <ModuleGrid
                    onModuleClick={handleModuleClick}
                    userName={data?.user_information?.name ?? ""}
                    userRole={getUserRole()}
                    isLoading={isLoading}
                />
            </ContentHeader>
        </PageContainer>
    );
};

export default OverviewPage;
