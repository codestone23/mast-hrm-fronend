import { PasswordStrength } from '@/components/authComponents/change-password-model/ChangePasswordModal';
import { DivisionStatus, ROLE_NAMES } from '@/constants/enums';

export const getDivisionStatus = (status: DivisionStatus) => {
    switch (status) {
        case DivisionStatus.ACTIVE:
            return 'Hoạt động';
        case DivisionStatus.INACTIVE:
            return 'Không hoạt động';
        default:
            return status;
    }
};

export const getPasswordStrength = (password: string): PasswordStrength => {
    let score = 0;

    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const strengthMap = {
        0: { label: 'Rất yếu', color: '#ef4444' },
        1: { label: 'Yếu', color: '#f97316' },
        2: { label: 'Trung bình', color: '#eab308' },
        3: { label: 'Mạnh', color: '#22c55e' },
        4: { label: 'Rất mạnh', color: '#16a34a' },
        5: { label: 'Cực mạnh', color: '#15803d' },
    };

    return { score, ...strengthMap[score as keyof typeof strengthMap] };
};

export const getRoleName = (roleName: ROLE_NAMES) => {
    switch (roleName) {
        case ROLE_NAMES.EMPLOYEE:
            return 'Nhân viên';
        case ROLE_NAMES.TEAM_LEADER:
            return 'Trưởng nhóm';
        case ROLE_NAMES.DIVISION_HEAD:
            return 'Trưởng phòng';
        case ROLE_NAMES.PROJECT_MANAGER:
            return 'Trưởng dự án';
        case ROLE_NAMES.HR_MANAGER:
            return 'Trưởng HR';
        case ROLE_NAMES.ADMIN:
            return 'Quản trị viên';
        default:
            return roleName;
    }
};
