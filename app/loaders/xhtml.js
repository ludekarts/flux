export default function XHTMLLoader ({ subscribe, publish }) {

  // Subscribe to customized load-success event.
  subscribe("load.success.XHTMLLoader", (content) => console.log(content));

  // Subscribe to customized load-error event.
  subscribe("load.error.XHTMLLoader", (error) => console.error("Nie mozna załadowac dokumentu xhtml", error));

  // Run Flux-Regiter-Process.
  publish("register.loader", {
    name: "XHTMLLoader",
    desc: "Załaduj plik xHTML",
    load () {
      // Run Flux-File-Loader.
      publish("load.file", { loader: "XHTMLLoader", type: "Text" });
    }
  });
};
