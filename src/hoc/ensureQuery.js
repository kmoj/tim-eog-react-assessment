import React from 'react';
import { defaultExchanges, subscriptionExchange, createClient, Provider } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const subscriptionClient = new SubscriptionClient('ws://react.eogresources.com/graphql', {});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation),
    }),
  ],
});

export default children => {
  return <Provider value={client}>{children}</Provider>;
};