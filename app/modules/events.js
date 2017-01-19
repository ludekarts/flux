// Flux Events.
export default {

  // Core Appplication events.
  "app" : {
    "initialized": "app.initialized",
    "error": "app.error",
    "require": {
      "tools": "app.require.tools",
      "loaders": "app.require.loaders",
      "widgets": "app.require.widgets",
      "converters": "app.require.converters"
    },
    "get": {
      "tools": "app.get.tools",
      "loaders": "app.get.loaders",
      "widgets": "app.get.widgets",
      "converters": "app.get.converters"
    }    
  },

  "ui": {
    "widget": {
      "render" : "ui.widget.render"
    }
  },

  "select" : {
    "widget": "select.widget",
    "tool": "selcet.tool",
  },

  // Content modification events.
  "content" : {
    "error": "content.error",
    "ready": "content.ready",
    "changed": "content.changed",
    "selection" : "content.selection"
  },

  // Content load event.
  "load" : {
    "file": "load.file",
    "error": "load.error",
    "success": "load.success"
  },

  // Reister plugins.
  "register" : {
    "loader": "register.loader",
    "widget" : "register.widget",
    "converter": "register.converter",
    "transformer": "register.transformer"
  },

  // "transformation": {
  //   "before": "transformation.before",
  //   "after": "transformation.after"
  // },
  //
  // "converion": {
  //   "before": "converion.before",
  //   "after": "converion.after"
  // }
};
