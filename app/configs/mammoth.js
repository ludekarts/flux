export default {
  styleMap: [
    "p.Math => p.math:fresh",
    "r.MathZnak => span.math:fresh",

    "b => em.bold:fresh",
    "i => em.italic:fresh",

    "p.Podtytu => p.subtitle:fresh",
    "p.Legenda => p.test > span.caption:fresh",
    "p.Akapitzlist => ol > li:fresh",

    "p[style-name='Title'] => h1.title",
    "r[style-name='Subtle Emphasis'] => p.subtitle",
    "r[style-name='Referencja Znak'] => span.reference"
  ]
};
