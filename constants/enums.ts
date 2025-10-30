export enum AuthRoutes {
    ROOT = "/",
    LOGIN = "/login",
    FORGOT_PASSWORD = "/forgot-password",
    OVERVIEW = "/overview",
    PERSONAL = "/staff",
    PERSONAL_INFO = "/personal-info",
}

export enum ROLE_NAMES {
    EMPLOYEE = "employee",
    TEAM_LEADER = "team_leader",
    DIVISION_HEAD = "division_head",
    PROJECT_MANAGER = "project_manager",
    HR_MANAGER = "hr_manager",
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin",
}

export enum REQUEST_TYPE {
    REMOTE_WORK = "REMOTE_WORK",
    DAY_OFF = "DAY_OFF",
    OVERTIME = "OVERTIME",
    LATE_EARLY = "LATE_EARLY",
    FORGOT_CHECKIN = "FORGOT_CHECKIN",
}

export enum REQUEST_STATUS {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export enum AssetCategory {
    LAPTOP = "LAPTOP",
    DESKTOP = "DESKTOP",
    MONITOR = "MONITOR",
    KEYBOARD = "KEYBOARD",
    MOUSE = "MOUSE",
    HEADPHONE = "HEADPHONE",
    PHONE = "PHONE",
    TABLET = "TABLET",
    FURNITURE = "FURNITURE",
    EQUIPMENT = "EQUIPMENT",
    OTHER = "OTHER",
}

export enum AssetStatus {
    AVAILABLE = "AVAILABLE",    // Có sẵn
    ASSIGNED = "ASSIGNED",      // Đã gán
    MAINTENANCE = "MAINTENANCE", // Bảo trì
    RETIRED = "RETIRED",        // Ngừng sử dụng
    LOST = "LOST",              // Mất
    DAMAGED = "DAMAGED",        // Hỏng
}

// Division
export enum DivisionType {
    TECHNICAL = "TECHNICAL",
    BUSINESS = "BUSINESS",
    OPERATIONS = "OPERATIONS",
    OTHER = "OTHER",
}

export enum DivisionStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}