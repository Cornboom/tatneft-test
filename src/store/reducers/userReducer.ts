import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { User, Reply, Test } from '../../types/types'
import { getUser, setUser as setLocalUser, setReplies as setLocalReplies } from "../../utils/localStorageManager.ts";

export interface UserState {
    user: User | null,
    replies: Reply[],
    tests: Test[],
}

const initialState: UserState = {
    user: getUser(),
    replies: [],
    tests: [],
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      setLocalUser(action.payload);
      state.user = action.payload;
    },
    setReplies: (state, action: PayloadAction<Reply[]>) => {
      setLocalReplies(action.payload.filter((reply) => !reply.is_completed))
      state.replies = action.payload;
    },
    setTests: (state, action: PayloadAction<Test[]>) => {
      state.tests = action.payload;
    },
  },
})

export const { setUser, setReplies, setTests } = userSlice.actions

export default userSlice.reducer
