define( ["js/qlik"], function (qlik) {
    'use strict';
    return  {
        app: "Stage 3 - Layout DE.qvf",
        globalSettings: {
            chartTypeIcons: {
                table: 'lui-icon lui-icon--small lui-icon--table',
                line: 'lui-icon lui-icon--small lui-icon--line-chart',
                bar: 'lui-icon lui-icon--small lui-icon--bar-chart',
                dot: 'lui-icon lui-icon--small lui-icon--scatter-chart',
                pie: 'lui-icon lui-icon--small lui-icon--pie-chart',
                tree: 'lui-icon lui-icon--small lui-icon--treemap',
                map: 'lui-icon lui-icon--small lui-icon--map',
                pivot: 'lui-icon lui-icon--small lui-icon--pivot-table ',
                combi: 'lui-icon lui-icon--small lui-icon--combo-chart'
            }
        },
        globalFields: {         // used for Set Analysis on e.g Dashboard
            year: 'Jahr',
            quarter: 'Quartal',
            month: 'Monat',
            monthYear: '[Monat Jahr]',
            day: 'Tag',
            date: '%Datum',
            quarterSign: 'Q'
        },
        globalValues: {         // global Name Labels used in Script
            total: 'gesamt'
        },
        dashboard: {
            settings: {
              lockExpressions: true, // add {1} to all expressions
              enableFields: ['Region','Quartal'],
              responive: true,
                useSpaceOnLargerScreens: true, // only usable if responive = false
              autoGrid: true,
              gridCols: 2,
              gridRows: 3,
              design: 'flat'      // flat / bullet
            },
            kpis:[
              {
                 id: "sales",
                 label: "Verkaufszahlen",
                 icon: 'fas fa-gears',
                 bgcolor: 'rgb(0,152,69)',
                 textcolor: '#fff',
                 helpText: 'KPI für die Verkaufszahlen <br> Link zum Analser ',
                 field: '[Umsatz pro Bestellzeile]',
                 aggr:  'sum',
                 expLabel: "Umsatz",
                 numberFormat: '#.##0 €; - #.##0 €',
                 lockExpression: true, // add {1} to this expressions
                 enableFields: ['Region','Quartal'],
                 showTotal: true,
                 showY2Y: true,
                 Y2YLineChart: true,
                 link2AnalyserId: 'sales',
                 showQuarterView: true,
                    QuarterBarChart: true,
                 showY2YTrendIcon: true
              },
              {
                 id: "products",
                 label: "Produkte",
                 icon: 'fa fa-barcode',
                 helpText: 'KPI für Produkte ',
                 link2AnalyserId: 'productview',
                 bgcolor: '#1C355E',
                 textcolor: 'white',
                 field: '[%ProduktNr]',
                 aggr:  'count',
                 showTotal: true,
                 showQuarterView: true,
                  QuarterBarChart: true,
                 showTop5: true,
                 distinct: true,
                    showNoDistinctAsSecond: true,      // only possible if distinct = true
                    useNonDistinctInQuarterView: true, // only possible if distinct = true
                 Y2YLineChart: true,
                 top5showField: 'Produkt',
                 top5ExprField: '[Umsatz pro Bestellzeile]',
                 top5ExprAggr: 'sum',
                 showTopOverall: true,
                 showTop5Chart: true
              },
              {
                 id: "customers",
                 label: "Kunden",
                 icon: 'far fa-address-card',
                 link2AnalyserId: 'customerview',
                 bgcolor: '#244B5A',
                 textcolor: 'white',
                 field: '[%KundenNr]',
                 aggr:  'count',
                 distinct: true,
                 Y2YLineChart: true,
                 showTop5: true,
                 top5showField: 'Kunde',
                 top5ExprField: '[Umsatz pro Bestellzeile]',
                 top5ExprAggr: 'sum'
              },
              {
                 id: "salesperson",
                 label: "Verkaufsteam",
                 icon: 'fas fa-user-astronaut',
                 bgcolor: '#870064',
                 textcolor: 'white',
                 field: '[%EmployeeIDLink]',
                 aggr:  'count',
                 distinct: true,
                 Y2YLineChart: false,
                 showTop5: true,
                 top5showField: 'Verkäufer',
                 top5ExprField: '[Umsatz pro Bestellzeile]',
                 top5ExprAggr: 'sum'
              }
              ,
              {
                 id: "orders",
                 label: "Bestellungen",
                 icon: 'fas fa-shopping-cart',
                 bgcolor: '#655DC6',
                 textcolor: 'white',
                 field: '[%BestellNr]',
                 aggr:  'count',
                 distinct: true,
                 Y2YLineChart: false,
                 showTop5: true,
                 top5showField: '%BestellNr',
                 top5ExprField: '[Umsatz pro Bestellzeile]',
                 top5ExprAggr: 'sum'
              }
              /*,
              {
                 id: "orders",
                 label: "Bestellungen",
                 icon: 'fas fa-user-astronaut',
                 bgcolor: '#655DC6',
                 textcolor: 'white',
                 field: '[%BestellNr]',
                 aggr:  'count',
                 distinct: true,
                 Y2YLineChart: false,
                 showTop5: true,
                 top5showField: '%BestellNr',
                 top5ExprField: '[Umsatz pro Bestellzeile]',
                 top5ExprAggr: 'sum'
              }
              */
            ]

        },
        analyser: {
          settings: {
            includeViewLinkInNavLvl1: true,        // true == add the current View to nav lvl 1
            ReplaceAnalyserLink: true,              // true == Show Lvl 1 Views as Tab
              showAlwaysOnlyIconInHeader: false,
              showCurrentNextAnalyser: false,
              removeActiveFromLinkList: true,
              changeAnalyserIcon: true,
            coloredChartHeaders: true,
              useViewColors: true,
            useViewColorsInNav: true
          },
          views: [
            {
              id: 'sales',
              label: 'Umsätze',
              subViewlabel: 'Vertrieb',
              icon: 'fas fa-dollar-sign',
              //bgColor: 'rgb(0,152,69)',
              color: 'rgb(0,152,69)',
              colorOverwriteNav: '#000',
              content: {
                label: 'Verkaufsübersicht',
                viewTemplate: 'chartView3',
                bgColor: 'rgb(0,152,69)',
                color: '#fff',
                charts: [
                    {
                      chartId: 'QEzhhL',
                      chartType: 'line',
                      name: 'Umsatz vs Quota',
                      helpText: 'Hile zum Chart 1 <br> ',
                      alternateCharts:[
                        { chartId: 'mZRnjf',
                          name: 'Übersicht',
                          chartType: 'table' },
                          { chartId: 'hMxBp',
                            name: 'Blabla',
                            chartType: 'line' }
                      ]
                    },
                    { chartId: 'hMxBp',
                      helpText: 'Hile zum Chart 2 <br> mehr..'
                    },
                    { chartId: 'DjHcRm',
                      helpText: 'Hile zum Chart 3 <br> mehr..',
                    }
                ]
              }
            },
            {
              id: 'sales-regional',
              isSubView: true,
              linkToViewId: 'sales',
              showLinkInHeader: true,
              showLinkInViewSubView: true,
              icon: 'fas fa-map-marker-alt',
              label: 'Reg. Vertrieb',
              color: 'rgb(0,152,69)',
              colorOverwriteNav: '#000',
              content: {
                label: 'Regionaler Vertrieb',
                viewTemplate: 'chartView3c',
                bgColor: '#fff',
                color: 'rgb(0,152,69)',
                charts: [
                    { chartId: 'zmzmp' },
                    { chartId: 'KUWaWqx'  },
                    {chartId: 'hgJSDDc'}
                ]
              }
            },
            {
              id: 'customers',
              icon: 'far fa-address-card',
              label: 'Kunden',
              color: '#244B5A',
              content: {
                label: 'Kunden',
                viewTemplate: 'chartView3a',
                bgColor: '#fff',
                color: '#244B5A',
                charts: [
                  {
                    chartId: 'YQTwhr',
                    chartType: 'combi',
                    name: 'Auftragswert',
                    alternateCharts:[
                      {
                          chartId: 'SPCHR',
                          name: 'Umsatz CY vs LY',
                          chartType: 'bar'
                      }
                    ]
                  },
                    { chartId: 'maSZrt'  },
                    { chartId: 'BgErak' }
                ],
                detailView: {

                }
              }
            },
            {
              id: 'customers-advanced',
              icon: 'fas fa-user-secret',
              label: 'Kunden (advanced)',
              isSubView: true,
              linkToViewId: 'customers',
              showLinkInHeader: true,
              showLinkInViewSubView: true,
              color: '#244B5A',
              content: {
                label: 'Kunden (advanced)',
                viewTemplate: 'chartView2a',
                bgColor: '#fff',
                color: '#244B5A',
                charts: [ { chartId: 'WVjA', }, { chartId: 'DyJPng'  } ]
              }
            },
            {
              id: 'sales-team',
              showLinkInHeader: true,
              showLinkInViewSubView: true,
              icon: 'fas fa-user-astronaut',
              label: 'Team',
              color: '#870064',
              content: {
                label: 'Vertriebsteam',
                viewTemplate: 'chartView3a',
                bgColor: '#fff',
                color: '#870064',
                charts: [
                    { chartId: 'DjHcRm' },
                    { chartId: 'QEzhhL'  },
                    { chartId: 'hMxBp',
                    chartType: 'combi',
                    name: 'Umsatz vs Quota',
                    helpText: 'Hile zum Chart 1 <br> ',
                    alternateCharts:[
                      {
                          chartId: 'LZyjdE',
                          name: 'Übersicht',
                          chartType: 'table'
                      }
                    ]}
                ]

              }
            },
            {
              id: 'productview',
              icon: 'fa fa-barcode',
              label: 'Produkte',
              color: '#1C355E',
              content: {
                label: 'Produkte',
                viewTemplate: 'chartView3c',
                bgColor: '#fff',
                color: '#1C355E',
                charts: [
                    { chartId: 'RVXJYn',
                    name: 'Bestellungen',
                    chartType: 'table',
                    alternateCharts:[
                      {
                          chartId: 'GLrcV',
                          name: 'CY vs LY',
                          chartType: 'tree'
                      }
                    ]

                   },
                    { chartId: 'keQuTJ'  },
                    { chartId: 'jjbshDX' }
                ]
              }
            }

          ]
        },
        sidebar: {
            settings: {
              showFilter: 'left',
              showCurrentSelections: 'right',    // if same as filter it will be an group
              showBookmarkList: 'right',        // if same as filter it will be an group
              showQVToolBar: 'bottom',          // footer | left | right
              leftSidebarAsDialog: false,
              rightSidebarAsDialog: false,
              showAddBookmarkInQnav: true,
              showUnLockInQnav: true,
              allwaysShowAllFilterGroups: false,
              icons: {
                leftSideBarIcon: 'fas fa-filter fa-fw',
                rightSideBarIcon: 'fas fa-list-alt fa-fw',
                helpIcon: 'far fa-question-circle fa-fw',
                qvToolbarBack: 'lui-icon  lui-icon--selections-back',
                qvToolbarClear: 'lui-icon  lui-icon--clear-selections',
                qvToolbarForward: 'lui-icon  lui-icon--selections-forward',
                qvToolbarLock: 'lui-icon  lui-icon--lock',
                qvToolbarUnlock: 'lui-icon lui-icon--unlock',
                qvToolbarAddBM: 'lui-icon  lui-icon--bookmark'
              }
            },
            filterGroups:[
              {
                name: 'Dashboard',
                showOnDashboard: true,
                onlyshowonDashboard: true,

                icon: 'fas fa-tachometer-alt fa-fw',
                filters: [
                  {
                    type: 'qvobject',
                    objectId: 'LpseEjN',
                    height: '240px'
                  },
                  {
                    type: 'qvobject',
                    objectId: 'prmkeR',
                    height: '150px'
                  },
                  {
                    type: 'qvobject',
                    objectId: 'eBhP',
                    height: '50px'
                  }
                ]
              },
              {
                name: 'Zeit',
                icon: 'far fa-clock fa-fw',
                filters: [
                  {
                    type: 'qvobject',
                    objectId: 'AcZmrU',
                    height: '220px'
                  },
                  {
                    type: 'qvobject',
                    objectId: 'PtPckJ',
                    height: '125px'
                  },
                  {
                    type: 'calbox',
                    label: '%Bestelldatum',
                    selectWhat: 'field',
                    field: '%Bestelldatum',
                    fromTo: true,
                    //multipleMonth: 3,
                    addWeeks2from: "+1w",
                    changeMonth: true,
                    changeYear: true,
                    dateFormat: "dd.mm.yy",
                    labelFrom: 'von: ',
                    labelTo: 'bis: '
                  }
                ]
              },
              {
                name: 'Main',
                icon: 'fas fa-certificate fa-fw',
                filters: [
                  {
                    type: 'qvobject',
                    objectId: 'tkqzwuP',
                    height: '150px'
                  },
                  {
                    type: 'qvobject',
                    objectId: 'SVcQW',
                    height: '200px'
                  },
                  {
                    type: 'slider',
                    sliderType: 'range',
                    selectWhat: 'field',
                    field: 'Katalogpreis',
                    getMinMaxFromField: true,
                    label: 'Katalogpreis',
                    labelFrom: '<br/> von:',
                    labelTo: '<br/>bis:',
                    symbol: ' €'
                  }
                ]
              },
              {
                name: 'Kunden',
                icon: 'far fa-address-card fa-fw',
                filters: [

                  {
                    type: 'qvobject',
                    objectId: 'LDZYc',
                    height: '100px'
                  },{
                    type: 'qvobject',
                    objectId: 'PagsH',
                    height: '200px'
                  },

                  {
                    type: 'qvobject',
                    objectId: 'JJZA',
                    height: '100px'
                  }
                ]
              },
              {
                name: 'Produkte',
                icon: 'fa fa-barcode fa-fw',
                filters: [
                  {
                    type: 'qvobject',
                    objectId: 'nAKrXZ',
                    height: '300px'
                  },

                  {
                    type: 'qvobject',
                    objectId: 'gawmbD',
                    height: '150px'
                  }
                ]
              },
              {
                name: 'Special Filter',
                specialFilter: true,
                onlyShowOnViews: ['customers-advanced'],
                disableOtherFilters: true,
                icon: 'fas fa-sliders-h fa-fw',
                filters: [
                  {
                    type: 'buttons',
                    label: 'Dimension',
                    variable1: 'dynDimension',
                    //multipleValues: true,
                    //addquote: "'", // use '"' for double and "'" for single quotes '' for no Quotes
                    //valuetype: 'array' ,
                    //value: [{label: 'Customer', value:'Kunde'},{label: 'Product', value:'Produkt'}]
                    valuetype: 'commaseparated' ,
                    value: 'Kunde,Produkt,Verkäufer',
                    //valuetype: 'fromfield',
                    //value: 'Region',
                    //useDistinct: true // default true

                  },
                  {
                    type: 'slider',
                    sliderType: 'range',
                    step: 100000,
                    label: 'Umsatzbereich',
                    selectWhat: 'variable',
                    variable1: 'rangeValue1',
                    variable2: 'rangeValue2',
                    labelFrom: '<br/> von:',
                    labelTo: '<br/>bis:',
                    maxExpr: 'ceil($(maxValDynDim))',
                  },
                  {
                    type: 'slider',
                    sliderType: 'range',
                    step: 100000,
                    label: 'Einfärben',
                    selectWhat: 'variable',
                    variable1: 'rangeValue3',
                    variable2: 'rangeValue4',
                    labelFrom: '<br/> unter (rot):',
                    labelTo: '<br/>über (grün):',
                    maxExpr: 'ceil($(maxValDynDim))',
                  },
                  {
                    type: 'drobdown',
                    label: 'nach',
                    variable1: 'dynDimension',
                    //multipleValues: true,
                    //addquote: "'", // use '"' for double and "'" for single quotes '' for no Quotes
                    //valuetype: 'array' ,
                    //value: [{label: 'Customer', value:'Kunde'},{label: 'Product', value:'Produkt'}]
                    valuetype: 'commaseparated' ,
                    value: 'Produkt,Kunde,Verkäufer',
                    //valuetype: 'fromfield',
                    //value: 'Region',
                    //useDistinct: true // default true
                  },
                  {
                    type: 'slider',
                    sliderType: 'single',
                    min: '-2',
                    max: '2',
                    step: 0.1,
                    label: 'Faktor',
                    selectWhat: 'variable',
                    variable1: 'factor',
                    labelFrom: '<br/>'
                  },
                  {
                    type: 'input',
                    label: 'Faktor:<br/>',
                    variable: 'factor',
                    changeOn: 'button'      // button || change
                  }
                ]
              }
            ]
        }
    }
} );
