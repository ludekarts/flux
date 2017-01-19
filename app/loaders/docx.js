// import Mammoth from "../vendors/mammoth";

const config = {
  styleMap: [
    "p.Math => p.math:fresh",
    "r.MathZnak => span.math:fresh",

    "b => em.bold:fresh",
    "i => em.italic:fresh",

    "p.Podtytu => p.subtitle:fresh",
    "p.Legenda => p.test > span.caption:fresh",
    "p.Akapitzlist => ol > li:fresh",

    "p[style-name='Title'] => h1.title",
    "r[style-name='Subtle Emphasis'] => p.subtitle",
    "r[style-name='Referencja Znak'] => span.reference"
  ]
};

export default function DOCXLoader ({ subscribe, publish }) {

  // Subscribe to customized load-success event.
  subscribe("load.success.DOCXLoader", (arrayBuffer) =>
    // Convert `docx` to `html` with Mammoth library.
    mammoth.convertToHtml({ arrayBuffer }, config)
      .then(result => {
        // Update Flux-Content.
        publish("content.ready", result.value);
        // Log messages.
        result.messages.forEach((message) => console.log(message.message));
      })
      // Run Flux-Error-Collector.
      .catch(error => publish("content.error", { msg: "DOCXLoader Error", error })));

  // Subscribe to customized load-error event.
  subscribe("load.error.DOCXLoader", (error) => console.error("Nie mozna załadowac dokumentu docx", error));

  // Run Flux-Regiter-Process.
  publish("register.loader", {
    name: "DOCXLoader",
    desc: "Załaduj plik DOCX",
    load () {
      // Run Flux-File-Loader.
      publish("load.file", { loader: "DOCXLoader", type: "ArrayBuffer" });
    }
  });
};
