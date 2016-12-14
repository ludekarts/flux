
// ---- COLLECTIONS PANEL ----------------

const colections = (() => {
  const template = `
    <ul class="equations">
      <li repeat="eq in equations" class="block">
        <a href="#{{eq.handler}}"class="block__title">{{ eq.content }}</a>
        <button class="block__close" data-action="delete" ><i class="material-icons">close</i></button>
      </li>
    </ul>`;

  return {

  }
})();



const images ='';

const links ='';

const equations ='';

const infos ='';

const generator ='';
