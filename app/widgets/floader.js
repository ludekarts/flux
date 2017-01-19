import { createElement } from "../modules/utils";

// Create Widget for Loading Files.
export default function FLoaderWidget ({ subscribe, publish }) {

  const _list = createElement({ type: "ul" });
  const _template = createElement({ type: "div.loaderbox" });

  _template.appendChild(_list);

  const addNewLoader = (loader) => {
    _list.appendChild(createElement({ type: 'li', content: loader.desc }));
  };


  subscribe("register.loader", addNewLoader);

  publish("register.widget", {
    name: "FLoaderWidget",
    desc: "Załaduj kontent",
    icon: "<i class=\"material-icons\">change_history</i>",
    template () {
      publish("ui.widget.render", _template);
    }
  });
};
