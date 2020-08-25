import styles from './LiveValues.style';
import _ from 'lodash';
import React, { useState } from 'react';
import ensureQuery from '../../../hoc/ensureQuery';
import { useSubscription } from 'urql';
import { useSelector } from 'react-redux';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    width: '10rem',
    textAlign: 'center',
    whiteSpace: 'wrap',
    margin: theme.spacing(1)
  }
}));

const subscriptionQuery = `
subscription Measurement {
  newMeasurement {
    metric
    at
    value
    unit
  }
}
`;

const LiveValues = () => {
  const activeMetrics = useSelector(state => state.metrics.selected);
  const classes = useStyles();
  let [liveMetrics, setLiveMetrics] = useState({});

  useSubscription({ query: subscriptionQuery }, (newMeasurement = [], response) => {
    let { metric, value, unit } = response.newMeasurement;
    liveMetrics[metric] = { value, unit, metric };
    setLiveMetrics(liveMetrics);
  });

  return (
    <div >
      {_.map(_.values(liveMetrics), ({ value, unit, metric }) => {
        if (activeMetrics.includes(metric)) {
          return (
            <Paper elevation={3} className={classes.paper}>
              <Card>
                <CardContent>
                  <h6>{metric}</h6>
                  <h3>
                    {value} {unit}
                  </h3>
                </CardContent>
              </Card>
            </Paper>
          );
        } else {
          return (<div></div>);
        }
      })}
    </div>
  );
};

export default () => {
  return ensureQuery(<LiveValues />);
};
