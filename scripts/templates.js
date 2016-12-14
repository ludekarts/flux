const FluxTemplates = {
  toolbox: `
    <div>
      <button repeat="tool in toolset" title="{{tool.tip}}" data-action="{{tool.name}}">{{tool.icon}}</button>
    </div>`,


  collections: ``,
  graphics: ``,
  links: ``,

  equations: `
    <ul class="equations">
      <li repeat="eq in equations" class="block">
        <a href="#{{eq.handler}}"class="block__title">{{ eq.content }}</a>
        <button class="block__close" data-action="delete" ><i class="material-icons">close</i></button>
      </li>
    </ul>`,

  info:``,
  convert: ``
};
