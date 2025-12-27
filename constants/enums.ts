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
}

export enum REQUEST_TYPE {
    REMOTE_WORK = "REMOTE_WORK",
    DAY_OFF = "DAY_OFF",
    OVERTIME = "OVERTIME",
    LATE_EARLY = "LATE_EARLY",
    FORGOT_CHECKIN = "FORGOT_CHECKIN",
}

export enum REQUEST_TYPE_LABEL {
    REMOTE_WORK = "Làm việc từ xa",
    DAY_OFF = "Nghỉ phép",
    OVERTIME = "Làm thêm giờ",
    LATE_EARLY = "Đi muộn/Về sớm",
    FORGOT_CHECKIN = "Quên chấm công",
}

export enum USER_STATUS {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
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

export enum NewsStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export enum ProjectStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    PENDING = "PENDING",
    CLOSED = "CLOSED",
}

export enum MilestoneProjectStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
}

export enum ProjectType {
    CUSTOMER = "CUSTOMER",
    IN_HOUSE = "IN_HOUSE",
    START_UP = "START_UP",
    INTERNAL = "INTERNAL",
}

export enum ProjectIndustry {
    IT = "IT",
    FINANCE = "FINANCE",
    MANUFACTURING = "MANUFACTURING",
    OTHER = "OTHER",
}

export enum ProjectCritical {
    LOW = "Low",
    MEDIUM = "Medium",
    HIGH = "High",
    CRITICAL = "Critical",
}

export enum ScopeType {
    COMPANY = "COMPANY",
    DIVISION = "DIVISION",
    TEAM = "TEAM",
    PROJECT = "PROJECT",
}

export enum HolidayType {
    NATIONAL = "NATIONAL",
    COMPANY = "COMPANY",
}

export enum HolidayStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export enum DurationType {
    FULL_DAY = "FULL_DAY",
    MORNING = "MORNING",
    AFTERNOON = "AFTERNOON",
}

export enum ProjectAccessType {
    COMPANY = "COMPANY",
    RESTRICTED = "RESTRICTED",
}
