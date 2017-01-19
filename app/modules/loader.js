import events from "./events";

// Handle file loading.
export default function FileLoader (pubsub) {
  let _loaderName, _uploadInput, _loaderType = "Text";

  // Load File.
  const uploadHandle = (event) => {
    const reader = new FileReader();
    // File lida success.
    reader.onload = function(loadEvent) {
      pubsub.publish(events.load.success + _loaderName, loadEvent.target.result);
    };
    // File lida failure.
    reader.onerror = function(error) {
      // TODO: Better error handeling.
      pubsub.publish(events.load.error + _loaderName, error);
    };

    // Get right method to load file.
    const method = 'readAs' + _loaderType;
    if (reader[method])
      reader[method](event.target.files[0]);
    else
      throw new Error(`FileLoader error. Method ${method} does not exist.`);
  };

  // Public API.
  return {
    // Iitialize loader.
    init (uploadInput) {
      _uploadInput = uploadInput;
      _uploadInput.addEventListener('change', uploadHandle);
    },

    // Open File Explorator on `load.file` event.
    load ({ loader, type }) {
      if (!loader) throw new Error('FileLoader require `loader` value in `load.file` event payload.');
      _loaderType = type || 'Text';
      _loaderName = '.' + loader;
      _uploadInput.click();
    }
  };
};
