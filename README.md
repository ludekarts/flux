# Flux Converter #

UI toll for converting `.docx` files into `CNXML` equivalents.


## Mammoth Import ##
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Transformers ##
Transformers are widgets regitser in the `toolbox` on a left hand side of the UI. They provide a simple way to
transform parsed MS Word document (`.docx`) into HTML structure understandable for `Converters`. Transformers can
make HTML structe/nesting more complex, other than inintial `Mammoth's` parsing process.

Each transformer need to return Object with following keys:

| Key | Type | Description |
|-----|------|-------------|
| name | string | Transfromer identifier |
| tooltip | string | Tooltip for the user |
| icon | HTML String | Icon that apears in the UI  |
| tranformer | function | Higher Order Function returns transforator (see below) |

**Tranformer Function**
Tranformer function is a Higher Order Function that will be called during registration process with PubSub Object. It gives it
ability to `subscribe` and `publish` messages into FLUX main comunication channel and cominicate with other components. Transformer need to return function which accept array of DOM elements and transfrom it into object with at least two properties.

| Key | Type | Description |
|-----|------|-------------|
| dom | array/element | Array or single DOM element that will replace transformer function input |
| com | object | Content Object Model - contains structure that can be used by the converter |

**Sample Transformer Structure**
```
const tansformerName = ((utils) => {

  const tranformer = ({subscribe, publish}) => {
    return (elements) => {
      return {dom, com}        
    }
  };

  return {
    tranformer
    name: 'string',
    icon: '<icon/>',
    tooltip: 'string'    
  }
})(FluxUtils2);
```

## Widgets ##
Widgets are an extension of Transformers. They apears on right hand side of the UI. They can help deal with navigation, browsing through elements & collections, managing tranformers and anything that developer could imagine. Similar to Transformers they have acces to FLUX main comunication channel which allow the to frealy comunicate with whole system.

`TIP` - Widgets simillar to the other components shpuld stay isolated. They should only communicate though PubSub channel, and modify only their own template.

Each widgets need to return object with following keys:

| Key | Type | Description |
|-----|------|-------------|
| name | string | Widget identifier |
| tooltip | string | Tooltip for the user |
| icon | HTML String | Icon that apears in the UI |
| init | function | Functin that will return DOM Element - the UI of the widget |

**Sample Widget Structure**
```
const widgetName = ((utils) => {

  const init = ({subscribe, publish}) => {  
    return <template/>;
  };

  return {
    init,
    name: 'string',
    icon: '<icon/>',
    tooltip: 'string',
  }
})(FluxUtils2);
```


## Converters ##
Converters are much simpler that Transformers and Widgets. They simply convert provided COM Object into desired output.

Each converter need to return object with following keys:

| Key | Type | Description |
|-----|------|-------------|
| match | string | Mathcing string - determine what element can be converted by this instance. Elements can be separate with comas |
| convert | function | Functin that will be called at convertion proces. It need to return string with new converted structure.|

**Sample Converter Structure**
```
const converterName = (() => {

  const converter = ({subscribe, publish}) => {  
    return (element) => {
      return '<converted-structure>';
    }
  };

  return {
    converter,
    match: 'h1.title'    
  }
})();

```

## FluxUtils2 ##
It provides a set of usefull tools for creating elements, genaraing UIDs, deal with DOM elements and arrays.
