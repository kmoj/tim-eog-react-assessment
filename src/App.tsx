import React from 'react';
import createStore from './store';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import Metric from './Features/Metric/Metric';
import Chart from './Features/Metric/Chart/Chart';
import LiveValues from './Features/Metric/LiveValues/LiveValues';
import Header from './components/Header';
import Wrapper from './components/Wrapper';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const store = createStore();
const theme = createMuiTheme({
  palette: {
    primary: {
      main: 'rgb(39,49,66)',
    },
    secondary: {
      main: 'rgb(197,208,222)',
    },
    background: {
      default: 'rgb(226,231,238)',
    },
  },
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <Wrapper>
        <Header />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Metric />
          </Grid>
          <Grid item xs={2}>
            <LiveValues />
          </Grid>
          <Grid item xs={10}>
            <Chart />
          </Grid>
        </Grid>

        <ToastContainer />
      </Wrapper>
    </Provider>
  </MuiThemeProvider>
);

export default App;
