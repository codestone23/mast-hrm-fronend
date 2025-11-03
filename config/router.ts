const ROUTERS = {
    AUTH: {
        LOGIN: "/login",
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
    },
};

export default ROUTERS;
