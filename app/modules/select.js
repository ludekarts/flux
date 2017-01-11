import utils from "./utils";
import events from "./events";

// Handle Flux elements and its selecton.
export default function Select (pubsub) {

  // Bucket.
  const _bucket = utils.bucket();

  // Elements + Flags.
  let _elements, _isShift = false, _isCtrl = false;

  // Fire onSelect event.
  const select = (event) => {
    // Do not selcet perfect-scrollbar's containers.
    if (event.target.matches('div#flux.flux') || event.target.matches('div.flux.ps-container')) return;

    if (_isShift) {
      // Select range of _elements.
      _bucket.addMany(event.target);
      if (_bucket.content().length === 2) {
        let startIndex = _elements.indexOf(_bucket.content()[0]);
        let endIndex = _elements.indexOf(_bucket.content()[1]);
        _bucket.clean();
        if (startIndex < endIndex) {
          for (let i = startIndex; i < endIndex + 1; i++) {
            _bucket.addMany(_elements[i]);
          }
        }
        else {
          for (let i = startIndex; i > endIndex - 1; i--) {
            _bucket.addMany(_elements[i]);
          }
          _bucket.reverse();
        }
      }
    }
    // Select multiple OR single element.
    else {
      if (_isCtrl){
        _bucket.addMany(event.target)
      } else {
        // Allow only for select one elememt if more then deselect them.
        if (_bucket.count() > 1) _bucket.clean();
        _bucket.addOne(event.target);
      }
    }
    // console.log(_bucket.content()); // Debug.
    pubsub.publish(events.content.selection, _bucket);
  };

  // Update elements. Called e.g. when order is changed.
  const update = (newElements) => {
    _elements = newElements;
    // Send notification.
    pubsub.publish(events.content.changed, _elements);
  };

  // Set _isShift flag.
  const isShift = (value) => {
    _isShift = value;
  };

  // Set _isCtrl flag.
  const isCtrl = (value) => {
    _isCtrl = value;
  };

  // Return cirent _elements value.
  const value = () => {
    return _elements;
  };

  // Public API.
  return { select, update, value, isShift, isCtrl };
}
