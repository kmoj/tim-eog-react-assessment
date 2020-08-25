import { createSlice } from 'redux-starter-kit';

const initialState = {
  selected: [],
};

const metricSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    setSelectedMetrics: (state, { payload }) => {
      return { ...state, selected: payload };
    }
  },
});

export const { actions, reducer } = metricSlice;