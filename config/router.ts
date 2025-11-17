const ROUTERS = {
    AUTH: {
        DEFAULT: "/",
        LOGIN: "/login",
        FORGOT_PASSWORD: "/forgot-password",
        RESET_PASSWORD: "/reset-password",
    },
    OVERVIEW: {
        BASE: "/overview",
    },
    PERSONAL: {
        BASE: "/me/staff",
        INFO: "/me/personal-info",
        PROJECTS: "/me/projects",
        TIMEKEEPING: "/me/timekeeping/time-sheets",
        COMPANY: "/me/company",
        NEWS: "/me/news",
        ASSETS: "/me/assets",
    },
    DIVISION: {
        BASE: "/division/dashboard",
        WORKFORCE: "/division/workforce",
        INVOICE: "/division/invoice",
        CUSTOMER: "/division/customer",
        REVENUE: "/division/revenue",
    },
    COMPANY: {
        BASE: "/company",
        ACCOUNTS: "/company/accounts",
        DIVISIONS: "/company/divisions",
    },
    HR: {
        STATS: "/hr/stats",
        ASSETS: "/hr/assets",
        USERS: "/hr/users",
        NEWS: "/hr/news",
    },
    SETTINGS: {
        BASE: "/settings/dashboard",
        NEWS: "/settings/news",
        NOTIFICATIONS: "/settings/notifications",
    },
    NOT_FOUND: "/404",
};

export default ROUTERS;
