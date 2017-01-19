import events from "./events";

// Allow to create dynamic buttons containers.
export default function Container (t5, pubsub) {
  const _filters = {}, _mods = {};

  // Sahlow equality check for two objects.
  const equalShalow = (a, b) => {
    for(let key in a)
      if(a[key] !== b[key])
        return false;
    return true;
  };

  // Create new container element.
  const create = (container, render, triggers) => {
    let _model = [];

    const _element = document.querySelector(`[data-flux="${container}"]`);
    const _render = t5.trace(render);

    const clickHandle = (event) => {
       const action = event.target.dataset.action;
       console.log('[Act]:', `"${action}"`); // Debug.

       if (action && triggers[action]) {
         triggers[action]();
       }
     };

     // Render empty.
     _element.innerHTML = _render({ data: [] });

     // Add Click listeners.
     _element.addEventListener('click', clickHandle);

     return {
       model: {
         push (data) {
           _model.push(data);
           _element.innerHTML = _render({data: _model}, _filters, _mods);
         },
         remove (item) {
           _model = _model.filter(element => equalShalow(element, item));
         },
         value () {
           return _model;
         }
       },
       element: _element,
     }
   };

  // Add filter for t5 templates.
  const addFilter = (name, callback) => {
    _filters[name] = callback;
  };

  // Add modifier for t5 templates.
  const addModifier = (name, callback) => {
    _mods[name] = callback;
  };

  // Public API.
  return { create, addFilter, addModifier }
}
