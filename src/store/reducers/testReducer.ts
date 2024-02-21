import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Reply, Test } from '../../types/types'
import { updateReply } from '../../utils/localStorageManager.ts'

export interface TestState {
    test: Test | null,
    reply: Reply | null,
}

const initialState: TestState = {
    test: null,
    reply: null,
}

export const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    setTest: (state, action: PayloadAction<Test>) => {
      state.test = action.payload;
    },
    setReply: (state, action: PayloadAction<Reply | null>) => {
      const reply = action.payload;
      if (reply) {
        updateReply(reply);
      }
      state.reply = action.payload;
    },
  },
})

export const { setTest, setReply } = testSlice.actions

export default testSlice.reducer
