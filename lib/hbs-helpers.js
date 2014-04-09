var fs = require('fs'),
	path = require('path'),
	walk = require('walk').walk,
	watch = require('node-watch');

	// Precompile a partial
var precompilePartialHelper = function(handlebars, partial) {
		handlebars.partials[partial] = handlebars.compile(handlebars.partials[partial]);
	},
	// Register the partial with handlebars directly
	registerPartialHelper = function(handlebars, directory, filepath, done) {
		var isValidTemplate = /\.(html|hbs)$/.test(filepath);

		if (!isValidTemplate) {
			return done(null);
		}

		fs.readFile(filepath, 'utf8', function(err, data) {
			if (!err) {
				var ext = path.extname(filepath);
				var templateName = path.relative(directory, filepath)
				.slice(0, -(ext.length)).replace(/[ -]/g, '_');
				handlebars.registerPartial(templateName, data);
				return done(undefined, templateName);
			}

			done(err);
		});
	};

// Constructor
Instance = function(hbs) {
	this.hbs = hbs;
};

// Precompile all partials
Instance.prototype.precompilePartials = function() {
	var handlebars = this.hbs.handlebars,
		partials = handlebars.partials;
	for (var partial in partials) {
		if (typeof partials[partial] === 'string') {
			precompilePartialHelper(handlebars, partial);
		}
	}
};

// Register all partials in a given directory
Instance.prototype.registerPartials = function(directory, opts, done) {
	if (Object.prototype.toString.call(opts) === "[object Function]") {
		done = opts;
		opts = {};
	}

	opts = opts || {};
	var handlebars = this.hbs.handlebars;

	// Load all partials in the specified directory
	walk(directory)
		.on('file', function(root, stat, next) {
			registerPartialHelper(handlebars, directory, path.join(root, stat.name), function(err, template) {
				if (opts.precompile && template) precompilePartialHelper(handlebars, template);
				next(err);
			});
		})
		.on('end', done || function() {});
};

// Register all partials in a given directory, and watch for changes to those
// files. When there is a change, register that updated file.
Instance.prototype.registerWatchedPartials = function(directory, opts, done) {
	if (Object.prototype.toString.call(opts) === "[object Function]") {
		done = opts;
		opts = {};
	}

	opts = opts || {};
	var handlebars = this.hbs.handlebars;

	// Load all partials in a given directory
	this.registerPartials(directory, opts, function() {
		// Now, setup the watcher on the directory
		watch(directory, function(filename) {
			registerPartialHelper(handlebars, directory, filename, function(err, template) {
				if (opts.precompile && template) precompilePartialHelper(handlebars, template);
				if (opts.onchange && template) opts.onchange(template);
			});
		});

		if (done) done();
	});
};

// Require a reference to the hbs object to initialize the instance
module.exports = function(hbs) {
	return new Instance(hbs);
};