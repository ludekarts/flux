import utils from "../modules/utils";


export default function FiguresWidget ({ subscribe, publish }) {

  const _template = utils.createElement({
    type: "h1.green",
    content: "Hallo Figure widget!"
  });

  subscribe("event.name", (response) => console.log(response));

  publish("register.widget", {
    name: "FiguresWidget",
    desc: "Grafiki",
    icon: "<i class=\"material-icons\">image</i>",
    template () {
      publish("ui.widget.render", _template);
    }
  });
};
