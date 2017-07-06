// Flux 3
// Wojciech Ludwin 2017, ludekarts@gmail.com

const flux3 = (function(elements, modal, scrollbar, {
  uid, elemntsToCnxml, createElement, elFromString, addToolButton, unwrapElement,
  insertSiblingNode, renderMath, toCnxml, cleanMath, formatXml, base64
}) {

  // Global state.
  const state = {
    history: [],
    equations: [],
    cnxml: elemntsToCnxml(elements)
  };

  // MathJax Config.
  window.MathJax = {
    showProcessingMessages: false,
    messageStyle: "none"
  };

  // UI References.
  const out = document.querySelector('#out');
  const flux3 = document.querySelector('#flux3');
  const intro = document.querySelector('#intro');
  const close = document.querySelector('#close');
  const confirm = document.querySelector('#confirm');
  const content = document.querySelector('#content');
  const toolbar = document.querySelector('#toolbar');
  const closeOut = document.querySelector('#closeOut');
  const equationsPanel = document.querySelector('[data-mthlib]');
  const toolbox = document.querySelector('#toolbar > div[data-tools-main]');
  const extensions = document.querySelector('#toolbar > div[data-tools-ext]');

  // Add CNXML tools.
  elements.forEach(addToolButton(toolbox));

  // Add unwrap element.
  toolbox.appendChild(createElement('i.separator'));
  toolbox.appendChild(createElement('button[title="Unwrap" data-action="unwrap"]' , '<i class="material-icons">content_cut</i>'));

  // Equations Panel scrollbar.
  scrollbar.initialize(equationsPanel);


  // ---- Helpers ----------------

  const isInContent = (el) => el.parentNode.closest('#content');

  const openExtensionPanel = (tool) => {
    extensions.innerHTML = '';
    tool.extend.forEach(addToolButton(extensions, true));
    extensions.classList.add('open');
  };

  const reRenderMath = () =>
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, renderMath]);

  const confirmAnimation = () => {
    confirm.classList.add('show')
    const removeClass = (event) => {
      confirm.classList.remove('show');
      confirm.removeEventListener("animationend", removeClass);
    };
    confirm.addEventListener("animationend", removeClass);
  };

  const addEquations = (source) => {
    source.forEach(math => {
      const content = (typeof math === 'string' ? math : math.outerHTML);
      const hash = base64(content);
      if (!~state.equations.indexOf(hash)) {
        state.equations.push(hash);
        equationsPanel.firstElementChild.appendChild(createElement('button[data-action="addEq"]', content));
      }
    });
    reRenderMath();
  };

  // ---- Local history ----------

  const recordAction = () => {
    state.history.push(content.innerHTML);
  };

  const restoreAction = () => {
    content.innerHTML = state.history.length > 0 ? state.history.pop() : '';
  };

  const backupContent = () => {
    try {
      const math = Array.from(equationsPanel.querySelectorAll('script')).map(eq => eq.textContent);
      localStorage.setItem('flux3-ct-backup', JSON.stringify({
        math: math,
        content: cleanMath(content.cloneNode(true)).innerHTML 
      }));
    } catch (error) {
      console.error(error);
      alert('Cannot save Backup Copy. See console for more details');
    }
    confirmAnimation();
  };

  const restoreContent = () => {
    const backup = JSON.parse(localStorage.getItem('flux3-ct-backup') || false);
    if (!backup.content) return alert('Backup copy does not exist!');
    else {
      content.innerHTML = backup.content;
      if (backup.math) {
        state.equations = [];
        addEquations(backup.math);
      }
    }
  };


  // ---- Event handlers ---------

  const pasteController = (evnet) => {
    evnet.preventDefault();

    // Clean clipboard data.
    const clipContent = event.clipboardData.getData('text/plain')
      //Replace links.
      .replace(/<link(.+?)\/>/g, (match, attrs) => `<reference ${attrs}>Reference</reference>`)
      // Remove MathML namespace.
      .replace(/<(\/?)m:|\s*xmlns(:m)?\s*="[\s\S\w]+?"/g, (match, slash) => ~match.indexOf('<') ? ('<' + slash) : '');

    // Remove styles before paste.
    document.execCommand("insertHTML", false, clipContent);

    // Search for equations and add it to the equationsPanel.
    if (~clipContent.indexOf('<math>')) {
      addEquations(Array.from(createElement('div', clipContent).querySelectorAll('math')));
    }
  };

  // Detect user actions.
  const detectAction = ({target, altKey}) => {

    // Detect action.
    const action = target.dataset.action;
    if (!action) return extensions.classList.remove('open');

    // Add entry to the local history.
    recordAction();

    // Intersect unwrap action.
    if (action === 'unwrap') return unwrapElement();

    // Detect tool.
    const tool = state.cnxml[action];
    if (!tool || !target.dataset.ext) extensions.classList.remove('open');
    if (tool.extend) openExtensionPanel(tool);

    // Add editable element.
    const selection = window.getSelection();

    if (selection.anchorNode && isInContent(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      // If selection contain end-sapce (double-click on word in Widnows) remove it from selection.
      if (/\s/.test(selectedText.slice(-1))) range.setEnd(range.endContainer, range.endOffset - 1);

      // Wrapp element / Add template.
      (selectedText.length > 0)
        ? range.surroundContents(tool.wrapp(uid))
        : altKey
          ? insertSiblingNode(selection.anchorNode, elFromString(tool.template(uid)))
          : range.insertNode(elFromString(tool.template(uid)));

      // Prevent from multiple wrapping in the same spot.
      selection.removeAllRanges();
    }
    else {
      // Add at the end.
      content.appendChild(elFromString(tool.template(uid)));
    }
  };

  // Handle alternative content actions. Alt + Click.
  const detectAltActions = ({target, altKey}) => {
    if (!altKey) return;

    // Detect request for extension menu.
    if (state.cnxml[target.dataset.type] && state.cnxml[target.dataset.type].extend) openExtensionPanel(state.cnxml[target.dataset.type]);
    else extensions.classList.remove('open');

    // Detect request for imege alt text modal.
    if (target.matches('div[data-type=media]')) modal.show(target);
  };

  // Add selected equation in place of cursor.
  const addEquation = ({target, altKey}) => {
    if (!target.matches('button')) return;

    // Delete equation button. 'Alt + LMB + Button'.
    if (altKey) {
      const index = state.equations.indexOf(base64(target.querySelector('script').textContent));
      if (index > -1 ) state.equations.splice(index, 1);
      return target.parentNode.removeChild(target);
    }

    // Add Equarion.
    const selection = window.getSelection();
    if (selection.anchorNode && isInContent(selection.anchorNode) ) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      if (selectedText.length === 0) {
        range.insertNode(elFromString(target.querySelector('script').textContent));
        reRenderMath();
      }
    }
  };

  const keyboardActions = ({altKey, shiftKey, ctrlKey, key, keyCode}) => {
    // Close extension panel. 'Esc'.
    if (key === 'Escape') extensions.classList.remove('open');

    // Undo create element action. 'Ctrl + Shift + z'.
    if (keyCode === 90 && ctrlKey && shiftKey) restoreAction();

    // Save content draft. 'Alt + s'.
    if (altKey && key === 's') backupContent();

    // Restore content draft. 'Alt + s'.
    if (altKey && key === 'r') restoreContent();

    // Toggle eqquations panel. 'Ctrl + Space'.
    if (ctrlKey && key === ' ') equationsPanel.classList.toggle('show');

    // Display CNXML. 'Alt + x'.
    if (altKey && key === 'x') {
      out.classList.add('show');
      out.firstElementChild.innerHTML = formatXml(toCnxml(content));
    }
  };

  const toggleIntro = (event) => {
    intro.classList.toggle('show');
  };

  const closeOutput = (event) => {
    out.classList.toggle('show');
  };



  // ---- Event listeners --------

  flux3.addEventListener('click', toggleIntro);
  close.addEventListener('click', toggleIntro);
  toolbar.addEventListener('click', detectAction);
  closeOut.addEventListener('click', closeOutput);
  content.addEventListener("paste", pasteController);
  content.addEventListener('click', detectAltActions);
  document.addEventListener('keyup', keyboardActions);
  equationsPanel.addEventListener('click', addEquation);

}(cnxmlElements, Modal, Ps, utils));
