mjQuery
======
Simple and lightweigh jQuery replacement. Using the same API with jQuery.

[![Travis](https://img.shields.io/travis/hoalongntc/mjquery.svg?style=flat-square)](https://travis-ci.org/hoalongntc/mjquery)
[![Download](https://img.shields.io/npm/dt/mjquery.svg?style=flat-square)](https://www.npmjs.com/package/mjquery)

## Install
```
npm install mjQuery
```

## APIs

### Global
Globally exported as `$`, `mjQuery` and `jQuery`

### Selecting Elements
```
$(selector)
```
`selector` can be:
+ `String`
+ `Node`
+ `NodeList`
+ `HTMLElement`
+ `HTMLCollection`
+ or another mQuery instance.

### DOM Manipulation
```
$(selector).show()          # Set display to none
$(selector).hide()          # Clear display css attribute
$(selector).addClass(className)
$(selector).removeClass(className)
$(selector).hasClass(className)
$(selector).toggleClass(className)
$(selector).css(cssClassname, cssValue)

$(selector).val()           # Get value of input
$(selector).val(value)      $ Set value to input
$(selector).attr(attrName)
$(selector).attr(attrName, value)
$(selector).removeAttr(attrName)
$(selector).prop(propName)
$(selector).prop(propName, value)
```

### Events
```
$(selector).on(eventName, eventHandler);
$(selector).click(eventHandler);
```

### Ajax Requests
```
$.ajax(url, options)
$.ajax(options)
```

`options` is a plain javascript object. Supported options:
+ `url`: The request URL
+ `method`: Request method. Eg: GET, POST, PUT, DELETE...
+ `data`: Data to send with request. Can be object or URLEncoded string
+ `success`: Function called on success (200 <= statusCode < 400)
+ `error`: Function called on failed

### Utils
```
$.param(obj) # Return URLEncoded query string
$.clone(obj) # Clone an object
```

## LICENSE
MIT