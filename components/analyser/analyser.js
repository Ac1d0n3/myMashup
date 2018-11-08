define(["js/qlik", thisMashupPath+"myconfig", thisMashupPath+"shared/bnHelper"],
function ( qlik, myConfig, bnHelper) {
  'use strict'

  bnHelper.loadCss('./components/analyser/analyser.css');
  let app;
  let analyser = angular.module("analyser", []);
  let analyserInit = false;

  analyser.controller('analyserCtrl', function($scope, $location) {

    let charts = [];
    let counter = 1;
    let views = [];
    let url = $location.path().split('/');
    let viewPort = url[2].toLowerCase();
    let chHeader = '';
    let analyserStyle = '';
    let links = [];

    bnHelper.loadStart();

    if ( !app ) { app = bnHelper.getQlikApp(); }

    if(myConfig.analyser.settings.coloredChartHeaders == true){
      chHeader = 'coloredChartHeader';
    }

    if(myConfig.analyser.settings.includeViewLinkInNavLvl1 == true){
      $('#analyserlink').attr('href', '#/analyser/' + viewPort);
    }

    myConfig.analyser.views.forEach(function(view) {
      views[view.id] = view.content;
      if(viewPort == view.id || viewPort == '') {

        $scope.viewIcon = view.icon;
        $scope.viewColor =  view.color;
        if(myConfig.analyser.settings.changeAnalyserIcon == true){
          $('#analyserIcon').removeClass();
          $('#analyserIcon').addClass(view.icon + ' fa-fw')
        }
        if(myConfig.analyser.settings.showCurrentNextAnalyser == true){
            $('#curviewport').html(': '+ view.label);
        }
      }

      if(myConfig.analyser.settings.useViewColors == true){
        analyserStyle += "."+ view.id +" h1 { color:"+ view.content.color +" !important; background-color:"+view.content.bgColor+"; }"
      }

      if(viewPort === undefined || viewPort == '') { viewPort = view.id };
    });

    bnHelper.filterGroupControll('regular',viewPort);

    $('#nav a').removeClass('active');
    if(myConfig.analyser.settings.ReplaceAnalyserLink == true){
      $('.'+viewPort).addClass('active');
      $('.'+viewPort).closest("ul").parent('li').find('a').first().addClass('active');
    } else {
      $('.'+viewPort).addClass('active');
      $('.'+viewPort).closest("ul").parent('li').find('a').first().addClass('active');
      $('#analyserlink').addClass('active');
    }

    if(myConfig.analyser.settings.useViewColors == true){
      if(analyserInit == false){
        $("<style>").text(analyserStyle).appendTo("head");
      }
      chHeader = viewPort;
      analyserInit = true;
    }


    if(views[viewPort] != undefined){
      $scope.viewTitle = views[viewPort].label;
      $scope.viewClass = views[viewPort].viewTemplate;

      views[viewPort].charts.forEach(function(chart) {
        var chartArea = bnHelper.createElement('div','qvobjectMod  '+ chHeader);
        var wrapper = bnHelper.createElement('div','analyserchartwrapper chartitem'+ counter);
        var altChartItems = bnHelper.createElement('div','chartSubNav');
        var link = bnHelper.createElement('a','chartNavItem active');
        var linkIcon = bnHelper.createElement('i',myConfig.globalSettings.chartTypeIcons[chart.chartType]+' fa-fw');
        var linkLabel = bnHelper.createElement('span','chartNavLabel');

        $(linkIcon).attr('title',chart.name);
        $(linkLabel).append(chart.name);
        $(link).append(linkIcon).append(linkLabel);

        if(typeof chart.helpText == "string" ){
            var helpBox = bnHelper.createElement('div','bnHelp hideObject');
            $(helpBox).append(chart.helpText);
            $(helpBox).css('display','none')
        }

        $(wrapper).append(helpBox).append(chartArea);
        $('#chartInclude').append(wrapper);

        $(link).on('click',function(){
            $(this).parent().find('a').removeClass('active');
            $(this).addClass('active');
            app.getObject(chartArea,chart.chartId)
        });

        var aChart = app.getObject(chartArea,chart.chartId).then( function() {
          if(typeof chart.alternateCharts === 'object'){
            $(altChartItems).append(link);
            chart.alternateCharts.forEach(function(altchart) {

                var link = bnHelper.createElement('a','chartNavItem');
                var linkIcon = bnHelper.createElement('i',myConfig.globalSettings.chartTypeIcons[altchart.chartType]+' fa-fw');
                var linkLabel = bnHelper.createElement('span','chartNavLabel');

                $(linkIcon).attr('title',altchart.name);
                $(linkLabel).append(altchart.name);
                $(link).append(linkIcon).append(linkLabel);
                $(altChartItems).append(link);

                $(link).on('click',function(){
                  $(this).parent().find('a').removeClass('active');
                  $(this).addClass('active');
                    app.getObject(chartArea,altchart.chartId);
                });

            });

            $(wrapper).append(altChartItems)
            $(wrapper).css(	'grid-template-areas','"chartspace" "chartsubmenu"')
          }
        });

		
        charts.push(aChart);
        counter++;

      });
      Promise.all(charts).then(data => { bnHelper.loadFinish();
		console.log(charts);
	  });
    } else {
      	$('#Error').html('No View for this Name found').show();
    }
	
	

  });

  return  analyser

});
