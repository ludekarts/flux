Flux 3
=================
> Graphical [CNXML](https://legacy.cnx.org/eip-help/help) editor for [Legacy CNX platform](https://legacy.cnx.org/).

Usage
-----------------
 1. Clone/download repo
 2. Open `index.html` file in browser. Preferable in Google Chrome, since its *contenteditable* behaviour is most comprehensive in this case.
 3. Learn **keyboard shortcuts** from the front page, to enable full potential of the app.


 Basic editing
 -----------------
 - **Adding elements**: Flux3 allows to add elements template for some of the most common tags in CNXML. By putting caret in the content area and clicking on the one of the icons on yellow toolbar, user can put according element template into the content.
 - **Wrapping content**: Second option is to select text (only text nodes applies to this) and then click on the element icon. This effects the text to be wrapped with a single element, not whole template, since it is imposible to determin what user want to do with the text.
This (bottom up) approach consist of creating the structure by wrapping text in desired elemtns.
 - **Adding siblings**: Sometimes user can find himself in a situation that it seems to be impossible to add another element to the tree in place they would want to. In that case it is worth to use following techniques:
  - Double click on the label of the elements that user want to add sibling to. This causes extending elements with `---` text node at the end.
  - `Alt + Element icon`: this causes adding a new element template after the node that have caret in it.
  - `Ctrl + ↑` or `Ctrl + ↓`: this causes moving element with caret in it before and after parent node.


Dealing with equations
 -----------------
 - Equations (represented in MathML) are rendered automaticly.
 - User can paste MathML markup directly to the content and it will be display as a MathJax element.
 - User can edit math by clicking on it with pressed `Alt` key, then put LaTeX formula into the input field.
 - All *pasted* MML equations are stored in *Equations panel (Ctrl + space)* from where they can be reuse. - Pressing `Ctrl + q` user can add empty equation in the place where caret is.


Upload to CNX
-----------------
1. Create account on CNX platform.
2. Create/derive a module.
3. Using flux3 tools create desirable document structure.
4. Press `alt + x` to display CNXML preview.
5. Copy entire content.
6. Open *full-source editing* mode in CNX editor.
7. Paste it instead of previous `<content>...</content>` tag.
8. Save module.


##### Build with
- [Perfect-scrollbar](https://github.com/noraesae/perfect-scrollbar)
- [Keymaster](https://github.com/madrobby/keymaster)
- [MathJax](https://github.com/mathjax/MathJax)
