import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    token: "",
    user: "",
};

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers:{
        userRegistration : ( state, action: PayloadAction<{ token: string }>)=>{
            state.token = action.payload.token;
        },
        userLoggedIn: (
          state: any,
          action: PayloadAction<{
            accessToken: string;
            user: any;
            refreshToken: string;
            }>
          ) => {
            state.token = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.user = action.payload.user;
          },
          userLoggedOut: (state) => {
            state.token = "";
            state.user = "";
          },
    }
})

export const  {userRegistration,userLoggedIn,userLoggedOut} = authSlice.actions;
export default authSlice.reducer;