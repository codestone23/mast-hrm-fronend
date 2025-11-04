import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DivisionListItem } from '@/types/api';
import LocalStorageUtil, { LOCAL_KEY } from '@/utils/LocalStorageUtil';

interface DivisionState {
  divisions: DivisionListItem[];
  selectedDivisionId: number | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DivisionState = {
  divisions: [],
  selectedDivisionId: null,
  isLoading: false,
  error: null,
};

// Load divisions và selectedDivisionId từ localStorage
export const loadDivisionsFromStorage = createAsyncThunk(
  'division/loadDivisionsFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const divisions = LocalStorageUtil.getItemObject(LOCAL_KEY.DIVISIONS, []) as DivisionListItem[];
      const selectedDivisionId = LocalStorageUtil.getItem(LOCAL_KEY.SELECTED_DIVISION_ID);
      return {
        divisions,
        selectedDivisionId: selectedDivisionId ? Number(selectedDivisionId) : null,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load divisions from storage';
      return rejectWithValue(errorMessage);
    }
  }
);

const divisionSlice = createSlice({
  name: 'division',
  initialState,
  reducers: {
    setDivisions: (state, action: PayloadAction<DivisionListItem[]>) => {
      state.divisions = action.payload;
      LocalStorageUtil.setItemObject(LOCAL_KEY.DIVISIONS, action.payload);
    },
    setSelectedDivisionId: (state, action: PayloadAction<number | null>) => {
      state.selectedDivisionId = action.payload;
      if (action.payload !== null) {
        LocalStorageUtil.setItem(LOCAL_KEY.SELECTED_DIVISION_ID, action.payload.toString());
      } else {
        LocalStorageUtil.removeItem(LOCAL_KEY.SELECTED_DIVISION_ID);
      }
    },
    clearDivisions: (state) => {
      state.divisions = [];
      state.selectedDivisionId = null;
      LocalStorageUtil.removeItem(LOCAL_KEY.DIVISIONS);
      LocalStorageUtil.removeItem(LOCAL_KEY.SELECTED_DIVISION_ID);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDivisionsFromStorage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadDivisionsFromStorage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.divisions = action.payload.divisions;
        state.selectedDivisionId = action.payload.selectedDivisionId;
        state.error = null;
      })
      .addCase(loadDivisionsFromStorage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setDivisions, setSelectedDivisionId, clearDivisions } = divisionSlice.actions;
export default divisionSlice.reducer;

