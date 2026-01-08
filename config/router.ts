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
        NEWS_DETAIL: "/me/news",
        ASSETS: "/me/assets",
        MEETING_ROOMS: "/me/meeting-rooms",
        DAILY_REPORTS: "/me/daily-reports",
        MY_TEAMS: "/me/my-teams",
    },
    DIVISION: {
        BASE: "/division/dashboard",
        WORKFORCE: "/division/workforce",
        PROJECTS: "/division/projects",
        INVOICE: "/division/invoice",
        CUSTOMER: "/division/customer",
        REVENUE: "/division/revenue",
        DAILY_REPORTS: "/division/daily-reports",
        REQUESTS: "/division/requests",
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
        DAILY_REPORTS: "/hr/daily-reports",
        REQUESTS: "/hr/requests",
    },
    SETTINGS: {
        BASE: "/settings/dashboard",
        NEWS: "/settings/news",
        NOTIFICATIONS: "/settings/notifications",
    },
    NOT_FOUND: "/404",
};

export default ROUTERS;
