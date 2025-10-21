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
    },
    DIVISION: {
        BASE: "/division/dashboard",
        WORKFORCE: "/division/workforce",
        INVOICE: "/division/invoice",
        CUSTOMER: "/division/customer",
        REVENUE: "/division/revenue",
    },
    SETTINGS: {
        BASE: "/settings",
        ACCOUNTS: "/settings/accounts",
        DIVISIONS: "/settings/divisions",
    },
};

export default ROUTERS;
