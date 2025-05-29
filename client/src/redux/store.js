import { configureStore } from "@reduxjs/toolkit";

// Slice imports
import userSlice from "./features/userSlice";
import themeModeSlice from "./features/themeModeSlice";
import authModalSlice from "./features/authModalSlice";
import globalLoadingSlice from "./features/globalLoadingSlice";
import appStateSlice from "./features/appStateSlice";

// Slice mapping
const rootReducer = {
  user: userSlice,
  themeMode: themeModeSlice,
  authModal: authModalSlice,
  globalLoading: globalLoadingSlice,
  appState: appStateSlice,
};

// Store configuration
const store = configureStore({
  reducer: rootReducer,
});

export default store;
