"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { setDivisions, setSelectedDivisionId } from "@/store/slices/divisionSlice";
import { useDivisionsList } from "@/hooks/useDivisions";
import { ROLE_NAMES } from "@/constants/enums";
import { User } from "@/constants/types";
import LocalStorageUtil, { LOCAL_KEY } from "@/utils/LocalStorageUtil";

interface UseDivisionInitializationProps {
  user: User | null;
  isAuthenticated: boolean;
}

export const useDivisionInitialization = ({
  user,
  isAuthenticated,
}: UseDivisionInitializationProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const userRoleNames = user?.role_assignments.map(role => role?.name?.toLowerCase());

  const shouldFetchDivisions =
    isAuthenticated &&
    !!user &&
    (userRoleNames?.includes(ROLE_NAMES.ADMIN) || userRoleNames?.includes(ROLE_NAMES.SUPER_ADMIN));

  const { data: divisionsData } = useDivisionsList(
    shouldFetchDivisions ? { limit: 100 } : undefined,
    { enabled: shouldFetchDivisions }
  );

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    const roleNames = user?.role_assignments.map(role => role.name?.toLowerCase());

    // Xử lý cho admin và super_admin
    if (roleNames?.includes(ROLE_NAMES.ADMIN) || roleNames?.includes(ROLE_NAMES.SUPER_ADMIN)) {
      if (divisionsData?.data && divisionsData.data.length > 0) {
        // Lưu divisions vào redux và localStorage
        dispatch(setDivisions(divisionsData.data));

        // Kiểm tra xem đã có selectedDivisionId trong localStorage chưa
        const savedDivisionId = LocalStorageUtil.getItem(LOCAL_KEY.SELECTED_DIVISION_ID);
        if (savedDivisionId) {
          const divisionId = Number(savedDivisionId);
          // Kiểm tra xem divisionId có trong list không
          const exists = divisionsData.data.some((div) => div.id === divisionId);
          if (exists) {
            dispatch(setSelectedDivisionId(divisionId));
          } else {
            // Nếu không tồn tại, lấy division đầu tiên
            dispatch(setSelectedDivisionId(divisionsData.data[0].id));
          }
        } else {
          // Lấy division đầu tiên làm selectedDivisionId
          dispatch(setSelectedDivisionId(divisionsData.data[0].id));
        }
      }
    }
    // Xử lý cho division_head
    else if (roleNames?.includes(ROLE_NAMES.DIVISION_HEAD)) {
      // Kiểm tra user_division trong user data (có thể là array hoặc object)
      const userWithDivision = user as User & {
        user_division?: Array<{
          divisionId?: number;
          division?: { id: number };
        }> | {
          divisionId?: number;
          division?: { id: number };
        };
      };
      
      const userDivision = userWithDivision.user_division;
      
      if (userDivision && Array.isArray(userDivision) && userDivision.length > 0) {
        const divisionId = userDivision[0].divisionId || userDivision[0].division?.id;
        if (divisionId) {
          dispatch(setSelectedDivisionId(divisionId));
        }
      } else if (userDivision && !Array.isArray(userDivision)) {
        const divisionId = userDivision.divisionId || userDivision.division?.id;
        if (divisionId) {
          dispatch(setSelectedDivisionId(divisionId));
        }
      }
    }
  }, [user, isAuthenticated, divisionsData, dispatch]);
};

