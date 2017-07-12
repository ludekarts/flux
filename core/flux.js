// Flux 3
// Wojciech Ludwin 2017, ludekarts@gmail.com

const flux3 = (function(elements, modal, scrollbar, {
  uid, elemntsToCnxml, createElement, elFromString, addToolButton, unwrapElement,
  insertSiblingNode, wrapMath, toCnxml, cleanMath, formatXml, base64, pause, loopstack,
  moveElement
}) {

  // Global state.
  const state = {
    equations: [],
    history: loopstack(15),
    cnxml: elemntsToCnxml(elements)
  };

  // MathJax Config.
  window.MathJax = {
    showProcessingMessages: false,
    messageStyle: "none",
    tex2jax: {
      inlineMath: [["$", "$"]]
    }
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
  const clipInput = document.querySelector('#clipInput');
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

  const wrapEquation = wrapMath(content);

  const reRenderMath = (callback) =>
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, wrapEquation, callback]);

  const confirmAnimation = () => {
    confirm.classList.add('show')
    const removeClass = (event) => {
      confirm.classList.remove('show');
      confirm.removeEventListener("animationend", removeClass);
    };
    confirm.addEventListener("animationend", removeClass);
  };

  const importEquations = (source) => {
    source.reverse().forEach((math, index) => {
      const content = (typeof math === 'string' ? math : math.outerHTML);
      const hash = base64(content);
      if (!~state.equations.indexOf(hash)) {
        state.equations.push(hash);
        equationsPanel.firstElementChild.insertBefore(createElement(`button${index === 0 ? '.last' : ''}[data-action="addEq"]`, content), equationsPanel.firstElementChild.firstChild);
      }
    });
    reRenderMath();
  };

  // ---- Local history ----------

  const recordState = () => {
    state.history.push(cleanMath(content.cloneNode(true)).innerHTML);
  };

  const restoreState = () => {
    // content.innerHTML = state.history.length > 0 ? state.history.pop() : '';
    const ct = state.history.pull();
    if (!ct) return;
    content.innerHTML = ct;
    reRenderMath();
  };

  const backupContent = () => {
    try {
      const math = Array
        .from(equationsPanel.querySelectorAll('script'))
        .reverse()
        .map(eq => eq.textContent);

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
        importEquations(backup.math.reverse());
      }
    }
  };

  // ---- Event handlers ---------

  const pasteController = (evnet) => {
    evnet.preventDefault();

    // Clean clipboard data.
    const clipContent = event.clipboardData.getData('text/plain')
      // Remove empty labels.
      .replace(/<label\s*?\/>/g,'')
      //Replace links.
      .replace(/<link(.+?)\/>/g, (match, attrs) => `<reference ${attrs}>Reference</reference>`)
      // Remove MathML namespace.
      .replace(/<(\/?)m:|\s*xmlns(:m)?\s*="[\s\S\w]+?"/g, (match, slash) => ~match.indexOf('<') ? ('<' + slash) : '');

    // Add entry to edit history.
    recordState();

    // Remove styles before paste.
    document.execCommand("insertHTML", false, clipContent);

    // Search for equations and add it to the equationsPanel.
    if (~clipContent.indexOf('<math>')) {
      importEquations(Array.from(createElement('div', clipContent).querySelectorAll('math')));
    }
  };

  // Detect typing and debounce.
  const saveHistory = pause(({ctrlKey, key}) => {
    if (!ctrlKey && key !== 'Escape') {
      state.history.push(cleanMath(content.cloneNode(true)).innerHTML)
    }
  }, 1500);


  // Detect user actions.
  const detectAction = ({target, altKey, ctrlKey}) => {

    // Detect action.
    const action = target.dataset.action;
    if (!action) return extensions.classList.remove('open');

    // Add entry to edit history.
    recordState();

    // Intersect unwrap action.
    if (action === 'unwrap') return unwrapElement('#content');

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
        ? tool.wrapp 
          ? range.surroundContents(tool.wrapp(uid))
          : false
        : altKey
          ? ctrlKey
            ? content.appendChild(elFromString(tool.template(uid)))
            : insertSiblingNode(selection.anchorNode, elFromString(tool.template(uid)))
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
  const detectAltActions = ({target, altKey, ctrlKey, shiftKey}) => {

    // Detect request for extension menu.
    if (altKey && state.cnxml[target.dataset.type] && state.cnxml[target.dataset.type].extend) openExtensionPanel(state.cnxml[target.dataset.type]);

    // Detect request for additional editor.
    if (altKey) modal.show(target);

    // Detect request for element ID.
    if (shiftKey) {
      clipInput.value = target.id;
      clipInput.select();
      document.execCommand('copy');
      console.log('Copy ID: ' + target.id);
    }
  };

  // Add selected equation after the cursor.
  const addEquation = ({target, altKey}) => {
    if (!target.matches('button')) return;

    // Delete equation button. 'Alt + LMB + Button'.
    if (altKey) {
      const index = state.equations.indexOf(base64(target.querySelector('script').textContent));
      if (index > -1) state.equations.splice(index, 1);
      return target.parentNode.removeChild(target);
    }

    // Add Equarion.
    const selection = window.getSelection();
    if (selection.anchorNode && isInContent(selection.anchorNode) ) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      if (selectedText.length === 0) {
        // Add entry to edit history.
        recordState();
        range.insertNode(elFromString(target.querySelector('script').textContent));
        reRenderMath();
      }
    }
  };

  const blockCtrlCommands = ({ctrlKey, key, keyCode}) => {

    // Override default Ctrl + z behaviour.
    if (ctrlKey && key === 'z') {
      event.preventDefault();
      restoreState();
    }

    // Save content draft. 'Ctrl + s'.
    if (ctrlKey && key === 's') {
      event.preventDefault();
      backupContent();
    }

    // Toggle eqquations panel. 'Ctrl + Up Arrow'.
    if (ctrlKey && keyCode === 38) {
      event.preventDefault();
      moveElement('#content', true);
    }

    // Toggle eqquations panel. 'Ctrl + Down Arrow'.
    if (ctrlKey && keyCode === 40) {
      event.preventDefault();
      moveElement('#content', false);
    }
  };

  const keyboardActions = (event) => {
    event.preventDefault();

    const {altKey, shiftKey, ctrlKey, key, keyCode, target} = event;

    // Close extension & equations panels. 'Esc'.
    if (key === 'Escape') {
      extensions.classList.remove('open');
      equationsPanel.classList.remove('show');
    }

    // Restore content draft. 'Alt + s'.
    if (altKey && key === 'r') restoreContent();

    // Toggle eqquations panel. 'Ctrl + Space'.
    if (ctrlKey && key === ' ') return equationsPanel.classList.toggle('show');

    // Display CNXML. 'Alt + x'.
    if (altKey && key === 'x') {
      out.classList.add('show');
      out.firstElementChild.value = formatXml(toCnxml(content));
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
  content.addEventListener("keydown", saveHistory);
  content.addEventListener("paste", pasteController);
  content.addEventListener('click', detectAltActions);
  document.addEventListener('keyup', keyboardActions);
  document.addEventListener('keydown', blockCtrlCommands);
  equationsPanel.addEventListener('click', addEquation);

}(cnxmlElements, Modal, Ps, utils));
