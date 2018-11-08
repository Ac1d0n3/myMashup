define(["js/qlik",thisMashupPath+"myconfig",thisMashupPath+"shared/bnHelper"],
function ( qlik, myConfig, bnHelper) {
  'use strict'
  let app;
  let dashboard = angular.module("dashboard", []);
  bnHelper.loadCss('./components/dashboard/dashboard.css');

  dashboard.controller("dashboardCtrl",  function($scope,$sce) {

    let values = myConfig.dashboard.kpis;
    let genStr = '';
    let distinct = '';
    let expr = {};
    let exprCount = 1;
    let check = [];
    let analyserLink = '#/analyser/';

    if ( !app ) { app = bnHelper.getQlikApp(); }

    bnHelper.loadStart();
    bnHelper.filterGroupControll('dashboard');



    $('#nav a').removeClass('active');
    $('#dashboardlink').addClass('active');

    myConfig.dashboard.settings.responive == true ? $scope.responiveClass = ' responive':$scope.responiveClass = '';

    $scope.kpis = myConfig.dashboard.kpis;
    $scope.total = myConfig.globalValues.total;
    $scope.quarterSign = myConfig.globalFields.quarterSign;

    genStr +=  '"cyLabel": { "qStringExpression":"=max('+ myConfig.globalFields.year+')"},';
    genStr +=  '"lyLabel": { "qStringExpression":"=max('+ myConfig.globalFields.year+')-1"}';

    myConfig.dashboard.kpis.forEach(function(kpi) {

      kpi.distinct == true ? distinct = 'distinct ':distinct = '';

      $scope.toggleQuarterView = function(kpi) {
        kpi.toggle_y2yView = true;
        kpi.toggle_QuarterView = true; kpi.toggle_Top5View = false;
        qlik.resize();
      };

      $scope.toggleY2YView = function(kpi) {
        kpi.toggle_y2yView = false;
        kpi.toggle_QuarterView = false; kpi.toggle_Top5View = false;
        qlik.resize();
      };

      $scope.toggleTop5View = function(kpi) {
        kpi.toggle_y2yView = true;
        kpi.toggle_Top5View = true; kpi.toggle_QuarterView = false;
        qlik.resize();

      };

      $scope.toggleQuarterInlineView = function(kpi){
        kpi.toggle_QuarterViewInline == true ? kpi.toggle_QuarterViewInline = false: kpi.toggle_QuarterViewInline = true;
        qlik.resize();
      }

      $scope.toggleTop5InlineView = function(kpi){
        kpi.toggle_Top5ViewInline == true ? kpi.toggle_Top5ViewInline = false: kpi.toggle_Top5ViewInline = true;
        qlik.resize();
      }

      expr.total = bnHelper.formatNumber(kpi.aggr + '({1}' + distinct +  kpi.field +')',kpi.numberFormat);
      expr.cy = bnHelper.formatNumber(kpi.aggr + '('+ distinct + bnHelper.buildSAy2y('',kpi.lockExpression,kpi.allowedFields) + kpi.field+')',kpi.numberFormat);
      expr.ly = bnHelper.formatNumber(kpi.aggr + '('+ distinct + bnHelper.buildSAy2y('-1',kpi.lockExpression,kpi.allowedFields) + kpi.field+')',kpi.numberFormat);

      exprCount > 0 ? genStr +=  ',' : genStr +=  '';

      genStr +=  '"'+ kpi.id +'total": { "qStringExpression":"='+ expr.total +'"},';
      genStr +=  '"'+ kpi.id +'cy": { "qStringExpression":"='+ expr.cy +'"},';
      genStr +=  '"'+ kpi.id +'ly": { "qStringExpression":"='+ expr.ly+'"}';

      if(kpi.Y2YLineChart == true){
        var calc = app.visualization.create( 'linechart',
        [	myConfig.globalFields.monthYear,
          {"qDef": {"qDef":"="+expr.total, "qLabel": kpi.expLabel }},
          {"qDef": {"qDef":"="+expr.cy, "qLabel": kpi.expLabel + ' CY' }},
          {"qDef": {"qDef":"="+expr.ly, "qLabel": kpi.expLabel + ' LY' }}
        ]
        ).then( function ( visual ) {
          visual.show( kpi.id+'chart' );
        });
        check.push(calc);
      }

      if(kpi.showQuarterView == true){
        for (var i = 1; i<5; i++){
          genStr +=  ',"'+ kpi.id +'Q' + i +'cy": { "qStringExpression":"='
            + bnHelper.formatNumber(kpi.aggr + '('+ distinct
            + bnHelper.buildSAy2y('',kpi.lockExpression,kpi.allowedFields, 'quarter', i)
            + kpi.field+')',kpi.numberFormat) +'"},';
          genStr +=  '"'+ kpi.id +'Q' + i +'ly": { "qStringExpression":"='
            + bnHelper.formatNumber(kpi.aggr + '('+ distinct
            + bnHelper.buildSAy2y('-1',kpi.lockExpression,kpi.allowedFields, 'quarter', i)
            + kpi.field+')',kpi.numberFormat) +'"}';
        }
        // Vis API Barchart
        if(kpi.QuarterBarChart == true){
          var calc = app.visualization.create( 'barchart',
          [ myConfig.globalFields.quarter, // Dim
              {"qDef": {"qDef":"=", "qLabel": ' ' }},
            {"qDef": {"qDef":"="+expr.cy, "qLabel": kpi.expLabel + ' CY' }}, // Measures
            {"qDef": {"qDef":"="+expr.ly , "qLabel": kpi.expLabel + ' LY' }}
          ]
          ).then( function ( visual ) {
            visual.show( kpi.id+'quarterchart' );
          });
          check.push(calc);
        }
      }

      if(kpi.showTop5 == true && kpi.top5ExprAggr != undefined){
        for(var i=1; i<6; i++) {
          genStr +=  ',"'+ kpi.id +'cy'+i+'Top5": { "qStringExpression":"=concat(distinct {1 <'
          + kpi.top5showField+'={'+"'"+'=rank('+ kpi.top5ExprAggr + '('
          + bnHelper.buildSAy2y('',kpi.lockExpression,kpi.allowedFields)
          + kpi.top5ExprField +'),4' +')='+i+' '+"'"+'}>}'+ kpi.top5showField +','+"'"+''+"'"+')"}';
          genStr +=  ',"'+ kpi.id +'ly'+i+'Top5": { "qStringExpression":"=concat(distinct {1 <'
          + kpi.top5showField+'={'+"'"+'=rank(' + kpi.top5ExprAggr + '('
          + bnHelper.buildSAy2y('-1',kpi.lockExpression,kpi.allowedFields)
          + kpi.top5ExprField +'),4' +')='+i+' '+"'"+'}>}'+ kpi.top5showField +','+"'"+''+"'"+')"}';
        }
        if(kpi.showTopOverall == true){
          genStr +=  ',"'+ kpi.id +'totalTop5": { "qStringExpression":"=concat(distinct {1 <'
          + kpi.top5showField+'={'+"'"+'=rank('
          + kpi.top5ExprAggr + '({1}'
          + kpi.top5ExprField
          +'),4' +')=1 '+"'"+'}>}'+ kpi.top5showField +','+"'"+' '+"'"+')"}';
        }
        if(kpi.showTop5Chart == true){
          var acy = kpi.top5ExprAggr + '('
          + bnHelper.buildSAy2y('',kpi.lockExpression,kpi.allowedFields)
          + kpi.top5ExprField +')';
          var aly = kpi.top5ExprAggr + '('
          + bnHelper.buildSAy2y('-1',kpi.lockExpression,kpi.allowedFields)
          + kpi.top5ExprField +')';
          var calc = app.visualization.create( 'barchart',
          [ {
              "qDef": {
                "qFieldDefs": [
                  kpi.top5showField
                ]
              },
              "qOtherTotalSpec": {
                "qOtherMode": "OTHER_COUNTED",
                "qOtherCounted": {
                  "qv": "5"
                },
                "qSuppressOther": true,
                "qOtherSortMode": "OTHER_SORT_DESCENDING"
              }
            }, // Dim
            {"qDef": {"qDef":"="+ acy , "qLabel": kpi.expLabel + ' CY' }}
          ],{
            "color": {
              "auto": false,
              "mode": "primary",
              "useBaseColors": "off",
              "paletteColor": {
                "index": -1,
                "color": "#333"
              }
            }
          }

          ).then( function ( visual ) {
            visual.show( kpi.id+'top5chartCY' );
          });
          check.push(calc);

          var calc = app.visualization.create( 'barchart',
          [ {
              "qDef": {
                "qFieldDefs": [
                  kpi.top5showField
                ]
              },
              "qOtherTotalSpec": {
                "qOtherMode": "OTHER_COUNTED",
                "qOtherCounted": {
                  "qv": "5"
                },
                "qSuppressOther": true,
                "qOtherSortMode": "OTHER_SORT_DESCENDING"
              }
            }, // Dim
            {"qDef": {"qDef":"="+aly, "qLabel": kpi.expLabel + ' LY' }}
          ],{
            "color": {
              "auto": false,
              "mode": "primary",
              "useBaseColors": "off",
              "paletteColor": {
                "index": -1,
                "color": "#afafaf"
              }
            }
          }
          ).then( function ( visual ) {
            visual.show( kpi.id+'top5chartLY' );
          });
          check.push(calc);

        }

      }

      if(kpi.distinct == true && kpi.showNoDistinctAsSecond == true){
        expr.total = bnHelper.formatNumber(kpi.aggr + '({1}' + kpi.field +')',kpi.numberFormat);
        expr.cy = bnHelper.formatNumber(kpi.aggr + '('+ bnHelper.buildSAy2y('',kpi.lockExpression,kpi.allowedFields) + kpi.field+')',kpi.numberFormat);
        expr.ly = bnHelper.formatNumber(kpi.aggr + '(' + bnHelper.buildSAy2y('-1',kpi.lockExpression,kpi.allowedFields) + kpi.field+')',kpi.numberFormat);
        genStr +=  ',"'+ kpi.id +'totalNoDistinct": { "qStringExpression":"='+ expr.total +'"},';
        genStr +=  '"'+ kpi.id +'cyNoDistinct": { "qStringExpression":"='+ expr.cy +'"},';
        genStr +=  '"'+ kpi.id +'lyNoDistinct": { "qStringExpression":"='+ expr.ly+'"}';
      }

      exprCount++;
    });

    var calc = app.createGenericObject(JSON.parse('{' + genStr + '}'), function ( reply ) {
       for (let key in reply) { $('.' + key ).html(reply[key]); }
    });
    check.push(calc);

    Promise.all(check).then(data => { bnHelper.loadFinish(); });

  });

  return  dashboard

});
