export default function buttonBlocks({ container, render, triggers }) {
  const _filters = {}, _mods = {};
  let _model = [], _beforeAction, _afterAction;


  const beforeAction = () => {
    if (_beforeAction) _beforeAction();
  };

  const afterAction = () => {
    if (_afterAction) _afterAction();
  };

  const clickHandle = (event) => {
    const action = event.target.dataset.action;
    if (action && triggers[action]) {
      beforeAction();
      triggers[action]();
      afterAction();
    }
  };

  // Sahlow equality check for two objects.
  const equalShalow = (a, b) => {
    for(let key in a) {
      if(a[key] !== b[key]) {
        return false;
      }
    }
    return true;
  }

  // Render empty.
  container.innerHTML = render({ data: [] });

  // Add Click listeners.
  container.addEventListener('click', clickHandle);

  return {
    model: {
      push (data) {
        _model.push(data);
        container.innerHTML = render({data: _model}, _filters, _mods);
      },
      remove (item) {
        _model = _model.filter(element => equalShalow(element, item));
      },
      value () {
        return _model;
      }
    },
    addFilter (name, callback) {
      _filters[name] = callback;
    },
    addModifier (name, callback) {
      _mods[name] = callback;
    },
    before (callback) {

    },

    after (callback) {

    }
  }
};
