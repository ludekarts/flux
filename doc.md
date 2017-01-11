# Flux Converter #

UI toll for converting `.docx` files into `CNXML` equivalents.

## Loaders

```
export default function LoaderName ({ subscribe, publish }) {

  subscribe("event.name", callback)
  ...

  publish("register.loader", {
    name: "LoaderName",
    desc: "Description - button label",
    load () {...}
  });
};
```

| Event name | Type | Required |Payload | Description |
|------------|------|:--------:|--------|-------------|
| register.loader | publish | ✔ | `{ name, desc, load() }` | Register loader in Flux ecostystem |
| content.ready | publish | ✔ | `HTML String` | Publishes event with parsed content as HTML string |
| content.error | publish | ✔ | `{ msg, error }` | Publishes event with any error that occured during a parsing process |
| load.file | publish | ✘ | `{ loader: "loaderName" }` | Publishes event that opens file loader (FL). The FL will emmit events with loaderName sufix |
| load.success.loaderName | subscribe | ✘ | `ArrayBuffer` | Listen for FL success event with array-buffer conatining loaded file content |
| load.error.loaderName | subscribe | ✘ | `error` |  Listen for FL erros during file loading |


## Widgets

```
export default function WidgetName ({ subscribe, publish }) {

  subscribe("event.name", callback)
  ...

  publish("register.widget", {
    name: "WidgetName",
    desc: "Description - tooltip",
    template () {...}
  });
};
```

| Event name | Type | Required |Payload | Description |
|------------|------|:--------:|--------|-------------|
| register.widget | publish | ✔ | `{ name, desc, template() }` | Register widget in Flux ecostystem |
