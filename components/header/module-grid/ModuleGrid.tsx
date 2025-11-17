"use client";

import React from "react";
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

const modules = getModules();

interface ModuleGridProps {
    onModuleClick?: (moduleId: string) => void;
    userName?: string;
    userRoles?: string[] | null;
    isLoading?: boolean;
}

const ModuleGrid: React.FC<ModuleGridProps> = (props: ModuleGridProps) => {
    const { onModuleClick, userName, userRoles, isLoading } = props;
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

    const filteredModules = modules.filter(
        (module) =>
            !module.allowedRoles || module.allowedRoles.some((role) => userRoles?.includes(role))
    );

    return (
        <GridContainer>
            <WelcomeSection>
                <WelcomeGreeting>{getGreeting()} {userName}</WelcomeGreeting>
                <WelcomeDate>{getCurrentDate()}</WelcomeDate>
                <WelcomeDivider />
            </WelcomeSection>

            <SystemSection>
                <SystemBar />
                <SystemTitle>Hệ thống</SystemTitle>
            </SystemSection>

            {isLoading ? (
                <Loading size="md" $center={true} />
            ) : (
                <ModulesGrid>
                    {filteredModules.map((module) => {
                        const IconComponent = module.icon;
                        return (
                            <ModuleCard
                                key={module.id}
                                onClick={() => handleModuleClick(module.path)}
                            >
                                <IconWrapper
                                    style={{ backgroundColor: module.color }}
                                >
                                    <IconComponent size={28} />
                                </IconWrapper>
                                <ModuleName>{module.name}</ModuleName>
                                <ModuleDescription>
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
