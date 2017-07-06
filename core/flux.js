// Flux 3
// Wojciech Ludwin 2017, ludekarts@gmail.com.

const flux3 = (function(elements, modal, {
  uid, elemntsToCnxml, createElement, elFromString,
  addToolButton, unwrapElement, insertSiblingNode,
  renderMath, toCnxml, cleanMath, formatXml
}) {

  // Global state.
  const state = {
    history: [],
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
  const content = document.querySelector('#content');
  const toolbar = document.querySelector('#toolbar');
  const closeOut = document.querySelector('#closeOut');
  const toolbox = document.querySelector('#toolbar > div[data-tools-main]');
  const extensions = document.querySelector('#toolbar > div[data-tools-ext]');

  // Add CNXML tools.
  elements.forEach(addToolButton(toolbox));

  // Add unwrap element.
  toolbox.appendChild(createElement('i.separator'));
  toolbox.appendChild(createElement('button[title="Unwrap" data-action="unwrap"]' , '<i class="material-icons">content_cut</i>'));


  // ---- Helpers ----------------

  const isInContent = (el) => el.parentNode.closest('#content');

  const openExtensionPanel = (tool) => {
    extensions.innerHTML = '';
    tool.extend.forEach(addToolButton(extensions, true));
    extensions.classList.add('open');
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
      localStorage.setItem('flux3-ct-backup', JSON.stringify({ content: cleanMath(content).innerHTML }));
    } catch (error) {
      console.error(error);
      alert('Cannot save Backup Copy. See console for more details');
    }
    console.log('Backup Copy Saved');
  };

  const restoreContent = () => {
    const backup = JSON.parse(localStorage.getItem('flux3-ct-backup') || false);
    if (!backup.content) return alert('Backup copy does not exist!');
    else {
      content.innerHTML = backup.content;
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, renderMath]);
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

    // Render math when paste into math node.
    if (event.target.matches('div[data-type=math]')) {
      MathJax.Hub.Queue(["Typeset", MathJax.Hub, renderMath]);
    }
  };

  // Detect user actions.
  const detectAction = ({target, ctrlKey}) => {

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
        : ctrlKey
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

  // Handle alternative actions. Alt + Click.
  const detectAltActions = ({target, altKey}) => {
    if (!altKey) return;

    // Detect request for extension menu.
    if (state.cnxml[target.dataset.type] && state.cnxml[target.dataset.type].extend) openExtensionPanel(state.cnxml[target.dataset.type]);
    else extensions.classList.remove('open');

    // Detect request for imege alt text modal.
    if (target.matches('div[data-type=media]')) modal.show(target);

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

}(cnxmlElements, Modal, utils));