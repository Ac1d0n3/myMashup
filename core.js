/*

*/


	/*  Fill in host and port for Qlik engine */
	var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );
	var config = {
		host: window.location.hostname,
		prefix: prefix,
		port: window.location.port,
		isSecure: window.location.protocol === "https:"
	};

	var mashupPath = window.location.pathname.split('/');
	var thisMashupPath =  mashupPath[1] +'/'+mashupPath[2]+'/';

	//to avoid errors in dev-hub: you can remove this when you have added an app

	require.config( {
		baseUrl: (config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "" ) + config.prefix + "resources"
	} );

	require(
		["js/qlik"
		, thisMashupPath + "myconfig"
		, thisMashupPath + "shared/bnHelper"
		, thisMashupPath + "components/dashboard/dashboard"
		, thisMashupPath + "components/analyser/analyser"
		, thisMashupPath + "shared/sidebar"
	], function ( qlik, myConfig, bnHelper ) {

		'use strict'

		let content = angular.module('content', ['ngRoute', 'dashboard', 'analyser','sidebar']);

		qlik.setOnError( function ( error ) {
				$('#Error').html(error).show();
		} );

		// Add Dynamic Content for Header and Footer

		bnHelper.initApp();

		/*	Root App */
		content.config(function($routeProvider) {
		  $routeProvider
		  .when('/', {
		    templateUrl : './components/dashboard/dashboard.html',
		    controller  : 'dashboardCtrl',
		  })
			.when('/analyser/:viewport?', {
		    templateUrl : './components/analyser/analyser.html',
		    controller  : 'analyserCtrl'
		  })
		  .otherwise({redirectTo: '/'});
		}).controller('rootCtrl', function ($scope, $routeParams) {
			qlik.theme.apply('myMashupTheme').then(function(result){
		 	});
  	}).filter('html', function($sce) {
	    return function(val) {
	        return $sce.trustAsHtml(val);
	    };
	});
	angular.bootstrap( document, ["content", "qlik-angular"] );
} );
