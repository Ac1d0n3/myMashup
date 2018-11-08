define(["js/qlik", thisMashupPath+"myconfig", thisMashupPath+"shared/bnHelper"],
function ( qlik, myConfig, bnHelper) {

  let app;
  let sidebar = angular.module("sidebar", []);

  sidebar.controller("sidebarCtrl", function($scope) {

    if ( !app ) {
     app = bnHelper.getQlikApp();
    }

    let addTo = '#sidebar-left';
    let groupCounter = 0;
    let sideWrapper = bnHelper.createElement('div','sideWrapper');
    let groupNav = bnHelper.createElement('div','filterGroupNav');

    $(sideWrapper).append(groupNav);

    if(myConfig.sidebar.filterGroups.length > 0){
        myConfig.sidebar.filterGroups.forEach(function(group){

          var ctrlClass = ' regularFilter';
          var ctrlClassIcon = ' regularFiltericon';

          if(myConfig.sidebar.filterGroups.length > 0){
            if(group.showOnDashboard == true) {
              if(group.onlyshowonDashboard == true){
                ctrlClass = ' dashboardFilter';
                ctrlClassIcon = ' dashboardFiltericon';
              } else {
                ctrlClass = ' dashboardFilter  regularFilter';
                ctrlClassIcon = ' dashboardFiltericon  regularFiltericon';
              }
            }

            if(group.specialFilter == true) {
              ctrlClass = ' specialFilter';
              ctrlClassIcon = ' specialFiltericon';
              if(group.onlyShowOnViews.length > 0){
                group.onlyShowOnViews.forEach(function(onview){
                    ctrlClass += ' '+ onview +'Filter';
                    ctrlClassIcon += ' '+ onview +'Filtericon';
                });
              }
            }

            var groupSet = bnHelper.createElement('div','sidegroup' + ctrlClass);
            var groupIcon = bnHelper.createElement('i', group.icon + ' groupitem' + ctrlClassIcon );

            $(groupIcon).on('click',function(){
              $('.sidegroup').hide();
              $('.groupitem').removeClass('active');
              $(groupSet).show();
              $(groupIcon).addClass('active');
              qlik.resize();
            })

            groupCounter > 0 ? $(groupSet).hide() : $(groupIcon).addClass('active');
            group.specialFilter == true ? $(groupIcon).hide(): false;
            $(groupNav).append(groupIcon);


            groupCounter++;
          }

          if(group.filters.length > 0){
            group.filters.forEach(function(filter){
              switch (filter.type){
                case 'qvobject':
                  var aObject = bnHelper.createElement('div','qvobjectside');
                  if(filter.height){ $(aObject).css('height', filter.height) }
                  $(groupSet).append(aObject);
                  app.getObject(aObject,filter.objectId);
                break;
                case 'slider':
                  bnHelper.createSlider(filter, groupSet );
                break;
                case 'buttons':
                  bnHelper.createButtons(filter, groupSet );
                break;
                case 'drobdown':
                  bnHelper.createDropDown(filter, groupSet );
                break;
                case 'input':
                  bnHelper.createInput(filter, groupSet );
                break;
                case 'calbox':
                  bnHelper.createCalBox(filter, groupSet );
                break;
              }
            });
          }
          if(myConfig.sidebar.filterGroups.length > 1){
            $(sideWrapper).append(groupSet);
          }

        });
        $('#sidebar-left').append(sideWrapper);

    }


    /* Current Selections */
    var selectionBox = bnHelper.createElement('div', 'curSelectionBox');
    var selectionBoxHeader = bnHelper.createElement('div', 'curSelectionBoxHeader');
    $(selectionBoxHeader).html('<i class="lui-icon lui-icon--selections-tool"></i> Aktuelle Auswahl')
    $('#sidebar-right').append(selectionBoxHeader);
    $('#sidebar-right').append(selectionBox);
    app.getList("CurrentSelections", function(reply, app) {
      $(selectionBox).empty();
      $('.toggleSide').removeClass('active');
      var mySelectedFields = reply.qSelectionObject.qSelections;
      var selectionslist = bnHelper.createElement('div', 'selectionList');
      var lockClass = ''; var hideClass = '';

      for (let j = 0; j < mySelectedFields.length; j++) {

        $('.toggleSide').addClass('active');
        if(mySelectedFields[j].qLocked==true ){
          icon = 'lock'; lockClass = ' qvLocked'; hideClass = ' hideObject';
        }  else {
          icon = 'unlock-alt'; lockClass = ''; hideClass = '';
        }

        var field =  bnHelper.createElement('div', 'bnCurSelectField');
        var clear =  bnHelper.createElement('i', 'far fa-trash-alt fa-fw'+hideClass);
        var lockUn =  bnHelper.createElement('i', 'fas fa-'+ icon +' fa-fw"'+lockClass);
        var fieldName =  bnHelper.createElement('span', '');

        $(clear).on('click', function(){
            app.field(mySelectedFields[j].qField).clear();
        });

        $(lockUn).on('click', function(){
            if(mySelectedFields[j].qLocked==true ){
              app.field(mySelectedFields[j].qField).unlock()
            }  else {
              app.field(mySelectedFields[j].qField).lock();
            }
        });

        $(fieldName).append( mySelectedFields[j].qField );
        $(field).append(fieldName);
        $(field).append(lockUn);
        $(field).append(clear);
        $(selectionslist).append(field);
      }
      $(selectionBox).append(selectionslist);
    });

    var bookmarkHeader =  bnHelper.createElement('div', 'bookmarkHeader');
    var bookmarkList =  bnHelper.createElement('div', 'bookmarkList');
    $(bookmarkHeader).append('<i class="lui-icon lui-icon--bookmark"></i>  Bookmarks')
    $('#sidebar-right').append(bookmarkHeader);
    $('#sidebar-right').append(bookmarkList);
    app.getList( "BookmarkList", function ( reply ) {
      var str = "";
      reply.qBookmarkList.qItems.forEach( function ( value ) {
        if ( value.qData.title ) {
          str += '<li><a data-id="' + value.qInfo.qId + '">' + value.qData.title + '</a></li>';
        }
      } );
      str += '</ul>';
      $( bookmarkList ).html( str ).find( 'a' ).on( 'click', function () {
        var id = $( this ).data( 'id' );
        if ( id ) {
          app.bookmark.apply( id );
        }
      } );
    } );

  });

  return sidebar


});
