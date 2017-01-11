import { createElement } from "../modules/utils";

export default function HTMLLoader ({ subscribe, publish }) {

  const html = `
    <p>Hello</p>
    <p>There</p>
    <p>Lorem</p>
    <p>Ipsum</p>
    <p>Dolor</p>
    <p>Upps</p>
  `;

  // Register Loader.
  publish("register.loader", {
    name: "HTMLLoader",
    desc: "Załaduj paczkę HTML",
    load () {
      publish("content.ready", html);
    }
  });
};
