/**
 * PubSub
 * version:     0.0.3
 * author:      Wojciech Ludwin for Katalyst Education 2016
 * contact:     ludekarts@gmail.com, wojciech.ludwin@katalysteducation.org
 * description: Basic implementation of Publish/Subscribe Pattern
**/
const PubSub = () => {
  const subscriptions = [];
  const API = {
    subscribe (topic, observer) {
      subscriptions[topic] || (subscriptions[topic] = [])
      subscriptions[topic].push(observer)
      return API;
    },

    unsubscribe (topic, observer) {
      if (!subscriptions[topic]) return API;
      let index = subscriptions[topic].indexOf(observer)
      if (~index) subscriptions[topic].splice(index, 1)
      return API;
    },

    publish (topic, message) {
      if (!subscriptions[topic]) return API;
      for (let i = subscriptions[topic].length - 1; i >= 0; i--){
        subscriptions[topic][i](message);
      }
      return API;
    },

    trace () {
      console.log(subscriptions);
      return API;
    }
  }
  // Public API.
  return API;
};
