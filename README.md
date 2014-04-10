# hbs-utils #

Helpers that are useful when using [hbs](https://github.com/donpark/hbs) and
[handlebars.js](http://github.com/wycats/handlebars.js).

## Install ##

```
npm install hbs-utils
```

## Use ##

You must initialize *hbs-utils* with a reference to the *hbs* module, like so:

```javascript
var hbs = require('hbs');
var hbsutils = require('hbs-utils')(hbs);
```

## API ##

hbs-utils exposes some methods that are useful when dealing with partials in
your app.

### Partials ###

**Registration**

```javascript
hbsutils.registerPartials(directory[, opts, done]);
hbsutils.registerWatchedPartials(directory[, opts, done]);
```

These convenience methods will register all partials (that have a *.html or *.hbs extension)
in the given directory. `registerPartials` will perform a one-time registration,
while `registerWatchedPartials` will watch the filesystem to changes to the directory,
and automatically re-register any changed or added partials directly with handlebars.

`opts` is an optional parameter that can safely be omitted. It is an object
that can contain the following settings:
- `precompile`: (default: `false`) If `true`, the partials will be pre-compiled when they are registered.
- `onchange`: A callback of the form `function(template) {}` that will be called everytime a partial has been changed (added or updated). The name of the partial is passed as the sole parameter.

`done` is an optional parameter that will be called when the initial registration of partials is complete.

Partials that are loaded from a directory are named based on their filename, where spaces and hyphens are replaced with an underscore character:

```
template.html      -> {{> template}}
template 2.html    -> {{> template_2}}
login view.hbs     -> {{> login_view}}
template-file.html -> {{> template_file}}
```

See the [handlebars.js](http://github.com/wycats/handlebars.js) README and docs for more information.

**Compilation**

```javascript
hbsutils.precompilePartials();
```

`precompilePartials` is a helper to automatically pre-compile any partials which
have been registered but not yet compiled.

## License (MIT) ##