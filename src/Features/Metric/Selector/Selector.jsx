import styles from './Select.style';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactSelect from 'react-select';
import { Provider, createClient, useQuery } from 'urql';
import { actions } from '../reducer';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `{
  getMetrics
}`;

const Selector = () => {
  const dispatch = useDispatch();
  const selectedMetrics = useSelector(state => state.metrics.selected);
  // fetch metric options
  const [result] = useQuery({ query });
  const { data = {} } = result;

  return (
    <div style={styles.selectWrapper}>
      <ReactSelect
        placeholder="Select..."
        options={data.getMetrics || []}
        isMulti
        value={selectedMetrics}
        onChange={metrics => dispatch(actions.setSelectedMetrics(metrics))}
        getOptionValue={val => val}
        getOptionLabel={val => _.startCase(val)}
      />
    </div>
  );
};

export default () => (
  <Provider value={client}>
    <Selector />
  </Provider>
);