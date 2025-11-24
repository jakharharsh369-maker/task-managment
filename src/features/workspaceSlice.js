import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../configs/api";

// Fetch workspaces from backend
export const fetchWorkspaces = createAsyncThunk(
  "workspace/fetchWorkspaces",
  async ({ getToken }) => {
    try {
      const token = await getToken();
      const { data } = await api.get("/api/workspaces", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.workspaces || [];
    } catch (error) {
      console.log(error?.response?.data?.message || error.message);
      throw error;
    }
  }
);

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  loading: false,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspaces: (state, action) => {
      state.workspaces = action.payload;
    },
    setCurrentWorkspace: (state, action) => {
      localStorage.setItem("currentWorkspaceId", action.payload);
      state.currentWorkspace = state.workspaces.find(
        (w) => w.id === action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = action.payload;

        if (action.payload.length > 0) {
          const localId = localStorage.getItem("currentWorkspaceId");

          const foundWorkspace = action.payload.find((w) => w.id === localId);

          state.currentWorkspace = foundWorkspace || action.payload[0];
        }
      })
      .addCase(fetchWorkspaces.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setWorkspaces, setCurrentWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
