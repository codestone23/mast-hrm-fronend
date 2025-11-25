import { DivisionStatus } from "@/constants/enums";

export const getDivisionStatus = (status: DivisionStatus) => {
    switch (status) {
        case DivisionStatus.ACTIVE:
            return "Hoạt động";
        case DivisionStatus.INACTIVE:
            return "Không hoạt động";
        default:
            return status;
    }
}