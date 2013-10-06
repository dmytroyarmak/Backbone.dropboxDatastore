/*jshint camelcase: false*/
/*global module:false*/

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>;*/\n',
    // Task configuration.
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= pkg.main %>',
        dest: '<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
      },
      all: ['Gruntfile.js', '<%= pkg.main %>', 'spec/*_spec.js']
    },
    jasmine: {
      src: '<%= pkg.main %>',
      options: {
        vendor: [
          'bower_components/underscore/underscore.js',
          'bower_components/backbone/backbone.js'
        ],
        specs: 'spec/*Spec.js'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  // Default task.
  grunt.registerTask('default', ['test', 'uglify']);
  grunt.registerTask('test', ['jshint', 'jasmine']);
};
