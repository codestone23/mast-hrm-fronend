"use client";

import React, { useMemo } from "react";
import {
    GridContainer,
    WelcomeSection,
    WelcomeGreeting,
    WelcomeDate,
    WelcomeDivider,
    SystemSection,
    SystemBar,
    SystemTitle,
    ModulesGrid,
    ModuleCard,
    IconWrapper,
    ModuleName,
    ModuleDescription,
} from "./moduleGridStyle";
import { Loading } from "@/components/common";
import { getModules } from "@/constants/modules";
import { useMobile } from "@/hooks/useMobile";

const modules = getModules();

interface ModuleGridProps {
    onModuleClick?: (moduleId: string) => void;
    userName?: string;
    userRoles?: string[] | null;
    isLoading?: boolean;
}

const ModuleGrid: React.FC<ModuleGridProps> = (props: ModuleGridProps) => {
    const { onModuleClick, userName, userRoles, isLoading } = props;
    const isMobile = useMobile();
    const handleModuleClick = (modulePath: string) => {
        if (onModuleClick) {
            onModuleClick(modulePath);
        }
    };

    const getCurrentDate = () => {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return now.toLocaleDateString("vi-VN", options);
    };

    const getGreeting = () => {
        const now = new Date();
        const hour = now.getHours();
        
        if (hour >= 5 && hour < 12) {
            return "Chào buổi sáng";
        } else if (hour >= 12 && hour < 18) {
            return "Chào buổi trưa";
        } else if (hour >= 18 && hour < 22) {
            return "Chào buổi tối";
        } else {
            return "Chào buổi tối";
        }
    };

    const filteredModules = useMemo(() => {
        return modules.filter(
            (module) =>
                !module.allowedRoles || module.allowedRoles.some((role) => userRoles?.includes(role))
        );
    }, [userRoles]);

    return (
        <GridContainer $isMobile={isMobile}>
            <WelcomeSection $isMobile={isMobile}>
                <WelcomeGreeting $isMobile={isMobile}>{getGreeting()} {userName}</WelcomeGreeting>
                <WelcomeDate $isMobile={isMobile}>{getCurrentDate()}</WelcomeDate>
                <WelcomeDivider />
            </WelcomeSection>

            <SystemSection $isMobile={isMobile}>
                <SystemBar $isMobile={isMobile} />
                <SystemTitle $isMobile={isMobile}>Hệ thống</SystemTitle>
            </SystemSection>

            {isLoading ? (
                <Loading size="md" $center={true} />
            ) : (
                <ModulesGrid $isMobile={isMobile}>
                    {filteredModules.map((module) => {
                        const IconComponent = module.icon;
                        return (
                            <ModuleCard
                                key={module.id}
                                $isMobile={isMobile}
                                onClick={() => handleModuleClick(module.path)}
                            >
                                <IconWrapper
                                    $isMobile={isMobile}
                                    $backgroundColor={module.color}
                                >
                                    <IconComponent size={isMobile ? 20 : 28} />
                                </IconWrapper>
                                <ModuleName $isMobile={isMobile}>{module.name}</ModuleName>
                                <ModuleDescription $isMobile={isMobile}>
                                    {module.description}
                                </ModuleDescription>
                            </ModuleCard>
                        );
                    })}
                </ModulesGrid>
            )}
        </GridContainer>
    );
};

export default ModuleGrid;
