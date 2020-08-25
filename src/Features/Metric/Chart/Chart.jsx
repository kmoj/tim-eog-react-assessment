import styles from './Chart.style';
import moment from 'moment';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import ensureQuery from '../../../hoc/ensureQuery';
import { useSelector } from 'react-redux';
import { useQuery, useSubscription } from 'urql';
import { toast } from 'react-toastify';
import LinearProgress from '@material-ui/core/LinearProgress';
import { LineChart, XAxis, YAxis, Line, CartesianGrid, Label, Tooltip } from 'recharts';
import { multiMeasureQuery, subscriptionQuery } from './queries';

const Chart = () => {
  const activeMetrics = useSelector(state => state.metrics.selected);
  const [before, setBefore] = useState(moment().format('x'));
  const [after, setAfter] = useState(
    moment()
      .subtract(5, 'minutes')
      .format('x'),
  );

  const [{ data = {}, error, fetching }] = useQuery({
    query: multiMeasureQuery,
    variables: {
      input: _.map(activeMetrics, metricName => ({ metricName, after, before })),
    },
  });
  const allMeasurements = data.getMultipleMeasurements;

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  useSubscription({ query: subscriptionQuery }, (newMeasurement = [], response) => {
    const { metric, value, unit, at } = response.newMeasurement;
    const activeIndex = _.findIndex(allMeasurements, { metric });
    if (activeIndex >= 0 && allMeasurements[activeIndex]) {
      allMeasurements[activeIndex] = {
        ...allMeasurements[activeIndex],
        measurements: [...allMeasurements[activeIndex].measurements, { metric, value, unit, at }],
      };
    }
  });

  useEffect(() => {
    setBefore(moment().format('x'));
    setAfter(
      moment()
        .subtract(5, 'minutes')
        .format('x'),
    );
  }, [activeMetrics]);

  const uniqUnits = _.uniq(_.map(allMeasurements, ({ measurements }) => measurements[0].unit));

  if (_.isEmpty(activeMetrics)) {
    return <div style={styles.empty}>Select metrics to view data</div>;
  }
  if (fetching) {
    return <LinearProgress />;
  }
  return (
    <div style={styles.wrapper}>
      <LineChart width={800} height={500}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="at"
          tickFormatter={time => moment(time, 'x').format('h:mm:ss A')}
          allowDuplicatedCategory={false}
        />
        {_.map(uniqUnits, unit => {
          return (
            <YAxis key={unit} domain={['auto', 'auto']} yAxisId={unit}>
              <Label position="insideTopLeft" offset={20}>
                {unit}
              </Label>
            </YAxis>
          );
        })}
        <Tooltip
          labelFormatter={at => moment(at, 'x').format('h:mm:ss A')}
          formatter={(value, name, { payload: { unit, metric } }) => [`${value} ${unit}`, _.startCase(metric)]}
        />
        {_.map(allMeasurements, (dataSet, index) => {
          return (
            <Line
              stroke={styles.colorArray[index]}
              dot={false}
              key={dataSet.metric}
              data={dataSet.measurements}
              dataKey="value"
              yAxisId={dataSet.measurements[0].unit}
            />
          );
        })}
      </LineChart>
    </div>
  );
};

export default () => {
  return ensureQuery(<Chart />);
};