/**
 * PubSub
 * version:     0.0.2
 * author:      Wojciech Ludwin for Katalyst Education 2016
 * contact:     ludekarts@gmail.com, wojciech.ludwin@katalysteducation.org
 * description: Basic implementation of Publish/Subscribe Pattern
**/
const PubSub = () => {
  const subscriptions = [];

  return {
    subscribe (topic, observer) {
      subscriptions[topic] || (subscriptions[topic] = [])
      subscriptions[topic].push(observer)
    },

    unsubscribe (topic, observer) {
      if (!subscriptions[topic]) return;
      let index = subscriptions[topic].indexOf(observer)
      if (~index) subscriptions[topic].splice(index, 1)
    },

    publish (topic, message) {
      if (!subscriptions[topic]) return;
      for (let i = subscriptions[topic].length - 1; i >= 0; i--)
        subscriptions[topic][i](message)
    }
  }
}
