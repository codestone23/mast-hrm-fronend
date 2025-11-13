import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from '@/services/auth.service';
import LocalStorageUtil, { LOCAL_KEY } from '@/utils/LocalStorageUtil';
import { UserProfile, User } from '@/constants/types';

interface UserState {
  data: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: UserState = {
  data: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// Helper function để convert User sang UserProfile
export const convertUserToUserProfile = (user: User): UserProfile => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: user.created_at,
    updated_at: user.updated_at,
    deleted_at: user.deleted_at,
    user_information: user.user_information as unknown as UserProfile['user_information'],
    role_assignments: user.role_assignments,
    education: undefined,
    experience: undefined,
    user_skills: undefined,
    assigned_devices: user.assigned_devices as unknown as UserProfile['assigned_devices'],
    annual_leave_quota: user.annual_leave_quota as unknown as UserProfile['annual_leave_quota'],
    join_date: user.join_date || undefined,
    today_attendance: user.today_attendance || undefined,
    remaining_leave_days: user.remaining_leave_days,
  };
};

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      if (response?.id) {
        const userProfile = convertUserToUserProfile(response);
        LocalStorageUtil.setItemObject(LOCAL_KEY.USER, userProfile);
        return userProfile;
      }
      throw new Error('No user data received');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user data';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk để load user data từ localStorage
export const loadUserFromStorage = createAsyncThunk(
  'user/loadUserFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const userData = LocalStorageUtil.getItemObject(LOCAL_KEY.USER);
      if (userData) {
        return userData as UserProfile;
      }
      return null;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load user from storage';
      return rejectWithValue(errorMessage);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.data = null;
      state.error = null;
      LocalStorageUtil.removeItem(LOCAL_KEY.USER);
    },
    updateUser: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
        LocalStorageUtil.setItemObject(LOCAL_KEY.USER, state.data);
      }
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user data
      .addCase(fetchUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
        state.isInitialized = true;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isInitialized = true;
      })
      // Load user from storage
      .addCase(loadUserFromStorage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
        // Chỉ set isInitialized = true nếu có data, để fetch từ API nếu không có
        if (action.payload) {
          state.isInitialized = true;
        } else {
          state.isInitialized = false;
        }
      })
      .addCase(loadUserFromStorage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isInitialized = true;
      });
  },
});

export const { clearUser, updateUser, setInitialized } = userSlice.actions;
export default userSlice.reducer;
