'use strict';
var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var wiredep = require('wiredep');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.option('test-framework', {
      desc: 'Test framework to be invoked',
      type: String,
      defaults: 'mocha'
    });

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });

    this.option('skip-install', {
      desc: 'Skips the installation of dependencies',
      type: Boolean
    });

    this.option('skip-install-message', {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    });
  },

  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    if (!this.options['skip-welcome-message']) {
      this.log(yosay('\'Allo \'allo! Out of the box I include HTML5 Boilerplate, jQuery, and a gulpfile.js to build your app.'));
    }

    done();
  },

  writing: {
    gulpfile: function () {
      this.template('gulpfile.js');
    },

    packageJSON: function () {
      this.template('_package.json', 'package.json');
    },

    git: function () {
      this.copy('gitignore', '.gitignore');
      this.copy('gitattributes', '.gitattributes');
    },

    bower: function () {
      var bower = {
        name: this._.slugify(this.appname),
        private: true,
        dependencies: {}
      };

      bower.dependencies.jquery = '~2.1.1';
      bower.dependencies.bootstrap = '~3.3.2';
      bower.dependencies.fontawesome = '~4.3.0';
      bower.dependencies.modernizr = '~2.8.1';

      this.copy('bowerrc', '.bowerrc');
      this.write('bower.json', JSON.stringify(bower, null, 2));
    },

    jshint: function () {
      this.copy('jshintrc', '.jshintrc');
    },

    editorConfig: function () {
      this.copy('editorconfig', '.editorconfig');
    },

    h5bp: function () {
      this.copy('favicon.ico', 'app/favicon.ico');
      this.copy('apple-touch-icon.png', 'app/apple-touch-icon.png');
      this.copy('robots.txt', 'app/robots.txt');
    },

    app: function () {
      this.mkdir('app');
      this.mkdir('app/images');
      this.mkdir('app/fonts');
      this.directory('scripts', 'app/scripts');
      this.directory('styles', 'app/styles');
      this.template('index.html', 'app/index.html');
      this.copy('block.html', 'app/block.html');
      this.copy('divider.html', 'app/divider.html');
      this.copy('footer.html', 'app/footer.html');
      this.copy('header.html', 'app/header.html');
      this.copy('home.html', 'app/home.html');
      this.copy('post-list-classic.html', 'app/post-list-classic.html');
      this.copy('post-list-thumb-left.html', 'app/post-list-thumbleft.html');
      this.copy('post-list-thumb.html', 'app/post-list-thumb.html');
      this.copy('post-single.html', 'app/post-single.html');
      this.copy('sidebar.html', 'app/sidebar.html');
      this.copy('subheader.html', 'app/subheader.html');
      this.copy('tabs.html', 'app/tabs.html');
      this.copy('testi.html', 'app/testi.html');
      this.copy('widget.html', 'app/widget.html');
    }
  },

  install: function () {
    var howToInstall =
      '\nAfter running ' +
      chalk.yellow.bold('npm install & bower install') +
      ', inject your' +
      '\nfront end dependencies by running ' +
      chalk.yellow.bold('gulp wiredep') +
      '.';

    if (this.options['skip-install']) {
      this.log(howToInstall);
      return;
    }

    this.installDependencies({
      skipMessage: this.options['skip-install-message'],
      skipInstall: this.options['skip-install']
    });

    this.on('end', function () {
      var bowerJson = this.dest.readJSON('bower.json');

      // wire Bower packages to .html
      wiredep({
        bowerJson: bowerJson,
        directory: 'bower_components',
        exclude: ['bootstrap', 'bootstrap.js'],
        ignorePath: /^(\.\.\/)*\.\./,
        src: 'app/index.html'
      });

      // ideally we should use composeWith, but we're invoking it here
      // because generator-mocha is changing the working directory
      // https://github.com/yeoman/generator-mocha/issues/28
      this.invoke(this.options['test-framework'], {
        options: {
          'skip-message': this.options['skip-install-message'],
          'skip-install': this.options['skip-install']
        }
      });
    }.bind(this));
  }
});
