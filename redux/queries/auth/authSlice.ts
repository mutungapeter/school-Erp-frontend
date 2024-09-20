import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

interface AuthState {
  accessToken: string;
  refreshToken: string;
  user: any;
  tokenExpiry: number | null;
  loading: boolean; 
  error: string | null;
}

const initialState: AuthState = {
  accessToken: "",
  refreshToken: "",
  user: null,
  tokenExpiry: null,
  loading: false, 
  error: null,
};

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers:{
      userLoading: (state) => {
        state.loading = true;
        state.error = null;  
      },
  
      userLoggedIn: (
        state,
        action: PayloadAction<{
          accessToken: string;
          refreshToken: string;
          user: any;
        }>
      ) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        
        const decodedToken: any = jwtDecode(action.payload.accessToken);
        state.tokenExpiry = decodedToken.exp * 1000; 
  
        state.loading = false; 
      },
  
      userLoggedOut: (state) => {
        state.accessToken = "";
        state.refreshToken = "";
        state.user = null;
        state.tokenExpiry = null;
        state.loading = false;
        Cookies.remove("accessToken");
       Cookies.remove("refreshToken");
      },
  
      userLoginFailed: (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;  
      },
      loadUser: (state) => {
        const accessToken = Cookies.get("accessToken");
        const refreshToken = Cookies.get("refreshToken");
  
        if (accessToken && refreshToken) {
          const decodedToken: any = jwtDecode(accessToken);
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.user = decodedToken;  
          state.tokenExpiry = decodedToken.exp * 1000;
          state.loading = false;
        } else {
          state.accessToken = "";
          state.refreshToken = "";
          state.user = null;
          state.tokenExpiry = null;
          state.loading = false;
        }
      },
    }
})

export const  {userLoggedIn,userLoggedOut,userLoginFailed, loadUser, userLoading} = authSlice.actions;
export default authSlice.reducer;