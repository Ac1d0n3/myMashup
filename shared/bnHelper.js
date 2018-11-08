define(["js/qlik", thisMashupPath+"myconfig"],
function ( qlik, myConfig) {
    'use strict'
    let app;

    /* Qlik Helper */
    function getQlikApp () { return qlik.openApp(myConfig.app, config); }

    function setVariable( name, val, useString = false) {
      if ( !app ) { app = getQlikApp(); }
      if(useString === true) { app.variable.setStringValue(name,val);
      } else {
        if(!isNaN(val)) app.variable.setNumValue(name, parseFloat(val));
        else app.variable.setStringValue(name,val);
      }
    }

    function setMultipleVar(thisElement,eachElement,varname, useQuotes, useVal = false){
        var counter = 0; var multipleValue = ''; var aValue = '';
        if(useQuotes == undefined) useQuotes = '';
        $(thisElement).toggleClass( "ui-state-active");
        $(eachElement).each(function(element2){
          if($(this).hasClass( "ui-state-active")){
            useVal = true? aValue = $(this).val() : aValue = $(this).attr('title');
            counter > 0 ? multipleValue += ',' : false;
            multipleValue += useQuotes + aValue + useQuotes;
            counter++; }
        });
        if(multipleValue == '') multipleValue = 'undefined';
        setVariable( varname, multipleValue);
    }

    function Date2QlikDate(aDate){
        var nDate = new Date(aDate);
        var nMonth = nDate.getUTCMonth() +1;
        var nDay = nDate.getUTCDate() +1;
        var nYear = nDate.getUTCFullYear();

        // DMY to Modified Julian calculated with an extra subtraction of 2415019.
        var nSerialDate =
          parseInt(( 1461 * ( nYear + 4800 + parseInt(( nMonth - 14 ) / 12) ) ) / 4) +
          parseInt(( 367 * ( nMonth - 2 - 12 * ( ( nMonth - 14 ) / 12 ) ) ) / 12) -
          parseInt(( 3 * ( parseInt(( nYear + 4900 + parseInt(( nMonth - 14 ) / 12) ) / 100) ) ) / 4) +
          nDay - 2415019 - 32075 - 153;

        if (nSerialDate < 60) {
            // Because of the 29-02-1900 bug, any serial date
            // under 60 is one off... Compensate.
            nSerialDate--;
        }
        return nSerialDate;
    }

    function SAallowField (fieldList){
      var str = ''; if(fieldList.length > 0){ fieldList.forEach(function(field){ str+= ','+ field +'=$::' + field; }); }
      return str;
    }

    function buildSAy2y(shift,locked, allowedFields, addQM = '' , QMValue =''){
        let saIdent = '$'; let saIdent2 = ''; var fieldList = []; var aQ = '';
        if(myConfig.dashboard.settings.lockExpressions == true || locked == true){
          saIdent = '1'; fieldList = myConfig.dashboard.settings.enableFields;
        } else { if(allowedFields!= undefined){ fieldList = allowedFields } }
        if(addQM == 'quarter'){ var aQ = ',' + myConfig.globalFields.quarter + '={'+myConfig.globalFields.quarterSign+ QMValue +'}'; }
        if(addQM == 'month'){ var aQ = ',' + myConfig.globalFields.month + '={'+ QMValue +'}'; }
        return '{ '+ saIdent +' <' + myConfig.globalFields.year +'={ $(=max('+ saIdent2 +' '+ myConfig.globalFields.year+') '+ shift +' )}'+ SAallowField (fieldList) + aQ +'>}';
    }

    function formatNumber(expr,format){
        let str; format === undefined ?  str = expr: str = 'num('+ expr +',' + "'" + format + "'"  + ')';
        return str;
    }

    /* General Helper */
    function parseDate(input, format) {
      format = format || 'yyyy-mm-dd'; // default format
      var parts = input.match(/(\d+)/g),
          i = 0, fmt = {};
      // extract date-part indexes from the format
      format.replace(/(yyyy|dd|mm)/g, function(part) { fmt[part] = i++; });
      return new Date(parts[fmt['yyyy']], parts[fmt['mm']]-1, parts[fmt['dd']]);
    }

    function is_int (value){
      if(parseFloat(value) == parseInt(value) && !isNaN(value))  return true; else return false;
    }

    function checkMobile(m) {
			let checkMobile = false;
			if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
				|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))
        checkMobile = true;
			return checkMobile;
		}

    function chunk(str, n) {
			let ret = [];
      let i; let len;
			for(i = 0, len = str.length; i < len; i += n) { ret.push(str.substr(i, n)) }
			return ret
		}

    function copyText(){
			let copyval; try{ copyval = document.execCommand("copy"); } catch(e){copyval = false; }
			return copyval
		}

    function copyInputToClipboard(element){
			let field = document.getElementById(element);
			field.focus(); field.setSelectionRange(0, field.value.length); this.copyText();
		}

    function hex2rgb(hex) {
			let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? [
				parseInt(result[1], 16),
				parseInt(result[2], 16),
				parseInt(result[3], 16)
			] : null;
		}

    function rgb2hex(r, g, b) {
			let hex = [ r.toString( 16 ), g.toString( 16 ), b.toString( 16 ) ];
			$.each( hex, function( nr, val ) {
			  if ( val.length === 1 ) { hex[ nr ] = "0" + val; }
			});
			return hex.join( "" ).toUpperCase();
		}

    function rgb2hsl(r, g, b){
			r /= 255, g /= 255, b /= 255;
			let max = Math.max(r, g, b), min = Math.min(r, g, b);
			let h, s, l = (max + min) / 2;
			if (max == min) { h = s = 0; }
			else {
				let d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				switch (max){
					case r: h = (g - b) / d + (g < b ? 6 : 0); break;
					case g: h = (b - r) / d + 2; break;
					case b: h = (r - g) / d + 4; break; }
				h /= 6;
			}
			return [(h*100+0.5)|0, ((s*100+0.5)|0) , ((l*100+0.5)|0)];
		}

    function hsl2rgb(h, s, l) {
			let m1, m2, hue, r, g, b;
			s /=100; l /= 100;
			if (s == 0)	r = g = b = (l * 255);
			else {	if (l <= 0.5) m2 = l * (s + 1);
				else m2 = l + s - l * s;
				m1 = l * 2 - m2;
				hue = h / 360;
				r = this.hue2rgb(m1, m2, hue + 1/3);
				g = this.hue2rgb(m1, m2, hue);
				b = this.hue2rgb(m1, m2, hue - 1/3);
			}
			return [Math.round(r),Math.round(g), Math.round(b)];
		}

    function hue2rgb(m1, m2, hue) {
			let v;
			if (hue < 0) hue += 1;
			else if (hue > 1) hue -= 1;
			if (6 * hue < 1) v = m1 + (m2 - m1) * hue * 6;
			else if (2 * hue < 1) v = m2;
			else if (3 * hue < 2) v = m1 + (m2 - m1) * (2/3 - hue) * 6;
			else v = m1;
			return 255 * v;
		}

    /* Add Elements */
    function createElement(tag, cls, html) {
        var el = document.createElement(tag);
        if (cls) { el.className = cls; }
        if (html !== undefined) { el.innerHTML = html; }
        return el;
    }

    function setChild(el, ch) {
      if (el.childNodes.length === 0) { el.appendChild(ch); }
		  else { el.replaceChild(ch, el.childNodes[0]); }
    }

    /* App Specific */


    /* jquery-ui Elements */
    function createSlider(layout, appendTo){
      var genStr = '';
      var slider = $(createElement('div', 'bnSliderDiv'));
      var sliderLabel = $(createElement('div', 'sliderLabelBox'));
      var minValue = 0; var maxValue = 100;
      var value1 = $(createElement('span', 'sliderValue'));
      var value2 = $(createElement('span', 'sliderValue'));

      if(layout.label != undefined){
        $(sliderLabel).append('<span class="sliderLabel">' + layout.label + '</span>');
      }
      if(layout.labelFrom != undefined  ){
        $(sliderLabel).append('<span class="sliderValue">' + layout.labelFrom + '</span>');
      }
      $(sliderLabel).append(value1);

      if(layout.sliderType.toLowerCase() == 'range' ) {
        if(layout.labelTo == undefined ){layout.labelTo = ' - ';}
        $(sliderLabel).append('<span class="sliderValue">' + layout.labelTo + '</span>');
        $(sliderLabel).append(value2);
      }

      switch (layout.sliderType.toLowerCase()){
        case 'single':
          var sliderSettings = {
            min: layout.min, max: layout.max, step: layout.step,
            slide: function(event, ui){ $(value1).html(ui.value) },
            stop: function( event, ui ) {
              if(layout.selectWhat == 'field'){
                if ( !app ) { app = getQlikApp(); }
                app.field(layout.field).selectMatch(ui.value , true);
              } else { setVariable( layout.variable1, ui.value); }
            }
          };
        break;

        case 'range':
          var sliderSettings = {
            range: true, min: layout.min, max: layout.max, step: layout.step,
            slide: function(event, ui){
              $(value1).html(ui.values[0]+layout.symbol)
              $(value2).html(ui.values[1]+layout.symbol)
            },
            stop: function( event, ui ) {
              if(layout.selectWhat == 'field'){
                if ( !app ) { app = getQlikApp(); }
                var srcStr = '>='  + ui.values[0] + '<='  + ui.values[1];
                app.field(layout.field).selectMatch(srcStr, true);
              } else {
                setVariable( layout.variable1, ui.values[0]);
                setVariable( layout.variable2, ui.values[1]);
              }
            }
          };
        break;
      }
      if(layout.symbol == undefined) layout.symbol = '';
      if(layout.hideLabel != true){ $(appendTo).append(sliderLabel); }
      $(appendTo).append(slider);
      slider.slider(sliderSettings);

      if ( !app ) { app = getQlikApp(); }

      if(layout.selectWhat.toLowerCase() == 'field'){
        genStr +=  '"'+ layout.field +'minFix": { "qStringExpression":"=floor(min({1}'+ layout.field +'))"},';
        genStr +=  '"'+ layout.field +'maxFix": { "qStringExpression":"=ceil(max({1}'+ layout.field +')))"},';
        genStr +=  '"'+ layout.field +'min": { "qStringExpression":"=floor(min('+ layout.field +'))"},';
        genStr +=  '"'+ layout.field +'max": { "qStringExpression":"=ceil(max('+ layout.field +'))"}';

        var calc = app.createGenericObject(JSON.parse('{' + genStr + '}'), function ( reply ) {
            $(value1).html(parseFloat(reply[layout.field +'min'])+layout.symbol);
            slider.slider('option',{min: parseFloat(reply[layout.field +'minFix']), max: parseFloat(reply[layout.field +'maxFix'])});

            if(layout.sliderType == 'range'){
              $(value2).html(parseFloat(reply[layout.field +'max'])+layout.symbol)
              slider.slider('values',1,parseFloat(reply[layout.field +'max']));
              slider.slider('values',0,parseFloat(reply[layout.field +'min']));
            } else {
            }

        });
      }

      if(layout.selectWhat.toLowerCase() == 'variable'){
        if(layout.minExpr != undefined){
          genStr +=  '"'+ layout.variable1 + layout.variable2 +'minExpr": { "qStringExpression":"='+layout.minExpr+'"},';
        }
        genStr +=  '"'+ layout.variable1 + layout.variable2 +'maxExpr": { "qStringExpression":"='+layout.maxExpr+'"},';
        genStr +=  '"'+ layout.variable1 + layout.variable2 +'val1Expr": { "qStringExpression":"='+layout.variable1+'"},';
        genStr +=  '"'+ layout.variable1 + layout.variable2 +'val2Expr": { "qStringExpression":"='+layout.variable2+'"}';

        calc = app.createGenericObject(JSON.parse('{' + genStr + '}'), function ( reply ) {
            if(layout.minExpr != undefined){ minValue =  reply[layout.variable1 + layout.variable2 +'minExpr']; }
            if(layout.min != undefined){ minValue =  layout.min; }
            if(layout.maxExpr != undefined){ maxValue =  reply[layout.variable1 + layout.variable2 +'maxExpr']; }
            if(layout.max != undefined){ maxValue =  layout.max; }
            $(value1).html(reply[layout.variable1 + layout.variable2 +'val1Expr']+layout.symbol);
            slider.slider('option',{min: parseFloat(minValue), max: parseFloat(maxValue)});
            if(layout.sliderType.toLowerCase() == 'range'){
              $(value2).html(parseFloat(reply[layout.variable1 + layout.variable2 +'val2Expr'])+layout.symbol)
              slider.slider('values',1,parseFloat(reply[layout.variable1 + layout.variable2 +'val2Expr']));
              slider.slider('values',0,parseFloat(reply[layout.variable1 + layout.variable2 +'val1Expr']));
            } else {

            }
        });
      }

    }

    function createInput(layout, appendTo){
        var inputDiv = $(createElement('div', 'bnInputDiv'));
        var formLabel = $(createElement('span', 'inputLabel',layout.label));
        var inputform = $(createElement('input', 'inputField' + layout.variable +'-val'));
        var inputButton = $(createElement('div', 'bnButton inputButton '));

        $(inputDiv).append(formLabel);
        $(inputDiv).append(inputform);

        $(appendTo).append(inputDiv);

        if(layout.changeOn == 'button' || layout.changeOn == undefined){
          $(inputDiv).append(inputButton);
          $(inputButton).button().html('ok').on('click',function(){
              setVariable( layout.variable1, $(inputform).val() );
          });
        } else {
          $(inputform).on('change',function(){
              setVariable( layout.variable, $(inputform).val() );
          });
        }

        var genStr =  '"'+ layout.variable +'value": { "qStringExpression":"='+layout.variable+'"}';
        var calc = app.createGenericObject(JSON.parse('{' + genStr + '}'), function ( reply ) {
            $(inputform).val(reply[layout.variable+'value']);
        });


    }

    function __getDPDate( element ) {
      var date;
      try {
        date = $.datepicker.parseDate( dateFormat, element.value );
      } catch( error ) {
        date = null;
      }

      return date;
    }
    function createCalBox(layout, appendTo){
      var calDiv = $(createElement('div', 'bnCalDiv'));
      var formLabel = $(createElement('div', 'calLabel', '<span>'+layout.label+'</span>'));
      var calFrom = $(createElement('input', 'calInput'));
      var labelFrom = $(createElement('td', 'calsubLabel', layout.labelFrom));
      var valueFrom = $(createElement('td', '')).append(calFrom);
      var row1 =  $(createElement('tr')).append(labelFrom).append(valueFrom);
      var calTable = $(createElement('table', 'calTable')).append(row1);

      var dateFormat = layout.dateFormat;
      if(dateFormat == undefined){ dateFormat = '' }
      if(layout.changeMonth == undefined){ layout.changeMonth = false }
      if(layout.changeYear == undefined){ layout.changeYear = false }
      if(layout.multipleMonth == undefined){ layout.multipleMonth = 1 }

      var calSet = {
          defaultDate: layout.addWeeks2from,
          changeMonth: layout.changeMonth,
          changeYear: layout.changeYear,
          numberOfMonths: layout.multipleMonth,
          dateFormat:dateFormat
      }

      $(calDiv).append(formLabel).append(calTable);
      $(appendTo).append(calDiv);

      if(layout.fromTo == true){
        var calTo = $(createElement('input', 'calInput'));
        var labelTo = $(createElement('td', 'calsubLabel', layout.labelTo));
        var valueTo = $(createElement('td', '')).append(calTo);
        var row2 =  $(createElement('tr')).append(labelTo).append(valueTo);
        $(calTable).append(row2)

        $(calFrom).datepicker(calSet).on( "change", function() { $(calTo).datepicker( "option", "minDate", __getDPDate( this ) );});
        $(calTo).datepicker(calSet).on( "change", function() { $(calFrom).datepicker( "option", "maxDate", __getDPDate( this ) );});

        var calButton = $(createElement('div', 'calButton bnButton'));
        $(calDiv).append(calButton);
        $(calButton).button().html('ok').on('click',function(){
           if(layout.selectWhat == 'field'){
             if ( !app ) { app = getQlikApp(); }
             var srcStr = '>=' + Date2QlikDate($.datepicker.parseDate(layout.dateFormat,$(calFrom).val())) + '<=' + Date2QlikDate($.datepicker.parseDate( layout.dateFormat,$(calTo).val()))
             app.field(layout.field).selectMatch(srcStr, true);
           } else {
              if(layout.qlikDate == true){
                var from =  Date2QlikDate($.datepicker.parseDate(layout.dateFormat,$(calFrom).val()));
                var to =  Date2QlikDate($.datepicker.parseDate(layout.dateFormat,$(calFrom).val()));
              } else { var from =  $(calFrom).val(); var to = $(calTo).val() }
              setVariable(layout.variable1, from);
              setVariable(layout.variable2, to);
           }
        });

      } else {

      }

      var genStr =  '"'+ layout.field +'Min": { "qStringExpression":"=year(min({1}'+layout.field+'))"},';
      genStr +=  '"'+ layout.field +'Max": { "qStringExpression":"=year(max({1}'+layout.field+'))"}';
      if ( !app ) { app = getQlikApp(); }
      var calc = app.createGenericObject(JSON.parse('{' + genStr + '}'), function ( reply ) {
        $(calFrom).datepicker("option", "yearRange", reply[layout.field +"Min"]+":"+reply[layout.field +"Max"]);
        if(layout.fromTo == true){
          $(calTo).datepicker("option", "yearRange", reply[layout.field +"Min"]+":"+reply[layout.field +"Max"]);
        }
        app.destroySessionObject(reply.qInfo.qId);
      });

    }

    function __createButton(label,value,varname,multiple,addquote){
      var button = $(createElement('div', 'bnButton ' + varname +'-val'));
      $(button).button().attr('title',value).html(label).on('click', function(){
        if(multiple == true){ setMultipleVar(element,'.'+varname+'-val',varname,addquote);
        } else { setVariable( varname, $(this).attr('title')); }
      });
      return button
    }
    function createButtons(layout, appendTo){

      var buttons = $(createElement('div', 'bnButtonDiv'));
      var formLabel = $(createElement('div', 'buttonsLabel'));
      $(formLabel).append('<span>' + layout.label + '</span>');
      $(buttons).append(formLabel);
      if(layout.value.length > 0){
        switch (layout.valuetype.toLowerCase()){
          case 'commaseparated':
            layout.value.split(',').forEach(function(element){
              var button = __createButton(element,element,layout.variable1,layout.multipleValues,layout.addquote);
              $(buttons).append(button);
            });
          break;
          case 'array':
            layout.value.forEach(function(element){
              var button = __createButton(element.label,element.value,layout.variable1,layout.multipleValues,layout.addquote);
              $(buttons).append(button);
            });
          break;
          case 'fromfield':
            layout.useDistinct == true || layout.useDistinct == undefined ? distinct = 'distinct ': distinct = '';
            layout.useAll == true || layout.useAll == undefined ? all = '{1}': all = '';
            var genStr =  '"'+ layout.variable1 +'concat": { "qStringExpression":"=concat('+ all + distinct +' '+ layout.value +','+"','"+')"}';
            calc = app.createGenericObject(JSON.parse('{' + genStr + '}'), function ( reply ) {
              reply[layout.variable1+'concat'].split(',').forEach(function(element){
                  var button = __createButton(element,element,layout.variable1,layout.multipleValues,layout.addquote);
                  $(buttons).append(button);
              });
              app.destroySessionObject(reply.qInfo.qId);
            });
          break;
        }
      }

      var genStr =  '"'+ layout.variable1 +'value": { "qStringExpression":"='+layout.variable1+'"}';
      var calc = app.createGenericObject(JSON.parse('{' + genStr + '}'), function ( reply ) {
        $('.'+layout.variable1+'button').removeClass('ui-state-active');
        if(layout.multipleValues == true){
          $('.'+layout.variable1+'button').each(function(){
            var that = this;
            reply[layout.variable1+'value'].replace(/"/g, "").replace(/'/g, '').split(',').forEach(function(element){
              if (element == $(that).attr('title')) {
                $(that).addClass('ui-state-active');
              }
            });
          });
        } else {
          $('.'+layout.variable1+'button').each(function(element){
            if (reply[layout.variable1+'value'] == $(this).attr('title')) {
              $(this).addClass('ui-state-active');
            }
          });
        }
      });
      $(appendTo).append(buttons);
    }


    function __createOption(label,value,varname,multiple,addquote){
      var option = $(createElement('option', 'bnButton ' + varname +'-val'));
      $(option).val(value).html(label);
      return option
    }
    function createDropDown(layout, appendTo){
      var dropdownDiv = $(createElement('div', 'bndropDownDiv'));
      var formLabel = $(createElement('div', 'buttonsLabel'));
      $(formLabel).append('<span>' + layout.label + '</span>');
      $(dropdownDiv).append(formLabel);

      var dropdown = $(createElement('select', ''));
      $(dropdownDiv).append(dropdown);
      $(dropdownDiv).append(dropdown);

      if(layout.value.length > 0){
        switch (layout.valuetype.toLowerCase()){
          case 'commaseparated':
            layout.value.split(',').forEach(function(element){
              var option = __createOption(element,element,layout.variable1,layout.multipleValues,layout.addquote);
              $(dropdown).append(option);
            });
          break;
          case 'array':
            layout.value.forEach(function(element){
              var button = __createOption(element.label,element.value,layout.variable1,layout.multipleValues,layout.addquote);
              $(dropdown).append(option);
            });
          break;
          case 'fromfield':
            layout.useDistinct == true || layout.useDistinct == undefined ? distinct = 'distinct ': distinct = '';
            layout.useAll == true || layout.useAll == undefined ? all = '{1}': all = '';
            var genStr =  '"'+ layout.variable1 +'concat": { "qStringExpression":"=concat('+ all + distinct +' '+ layout.value +','+"','"+')"}';

            calc = app.createGenericObject(JSON.parse('{' + genStr + '}'), function ( reply ) {
              reply[layout.variable1+'concat'].split(',').forEach(function(element){
                  var button = __createOption(element,element,layout.variable1,layout.multipleValues,layout.addquote);
                  $(dropdown).append(option);
              });
              app.destroySessionObject(reply.qInfo.qId);
            });
          break;
        }
      }

      $(dropdown).selectmenu({
        change: function( event, ui ) {
          console.log($(this).val());
          if(layout.multipleValues == true){
            setMultipleVar(this,'.'+layout.variable1+'-val',layout.variable1,layout.addquote);
          } else {
            setVariable( layout.variable1, $(this).val());
          }
        }
      });
      $(appendTo).append(dropdownDiv);

      var genStr =  '"'+ layout.variable1 +'value": { "qStringExpression":"='+layout.variable1+'"}';
      var calc = app.createGenericObject(JSON.parse('{' + genStr + '}'), function ( reply ) {
        $('.'+layout.variable1+'-val').removeClass('ui-state-active');
        if(layout.multipleValues == true){
          $('.'+layout.variable1+'-val').each(function(){
            var that = this;
            reply[layout.variable1+'value'].replace(/"/g, "").replace(/'/g, '').split(',').forEach(function(element){
              if (element == $(that).val()) {

                //$(dropdown).val(element).trigger("change");;
                $(that).addClass('ui-state-active');
              }
            });
          });
        } else {
          $('.'+layout.variable1+'-val').each(function(element){
            if (reply[layout.variable1+'value'] == $(this).val() || reply[layout.variable1+'value'] == $(this).attr('title')) {
              $(this).addClass('ui-state-active');
                if(reply[layout.variable1+'value'] == $(this).val()) $(this).attr('selected','selected');
              $(dropdownDiv).find('.ui-selectmenu-text').html($(this).val());
            }
          });
        }
      });

    }


    /* App Specific */
    function gridControll(){
      let nC = ''; let nR = '';
      if(myConfig.dashboard.settings.autoGrid == true){
        var i = 0; while ( ( i * i) < myConfig.dashboard.kpis.length) { i += 0.5; } ;
        myConfig.dashboard.settings.gridCols = Math.ceil(i);
        myConfig.dashboard.settings.gridRows = Math.floor(i); }
      let gridCols = 100 / myConfig.dashboard.settings.gridCols +'%';
      let gridRows = 100 / myConfig.dashboard.settings.gridRows +'%';
      for (let i = 1;  i <= myConfig.dashboard.settings.gridCols; i++){ nC = nC + gridCols; }
      for (let i = 1;  i <= myConfig.dashboard.settings.gridRows; i++){ nR = nR + gridRows; }
      jQuery('body').bind("DOMSubtreeModified", function(e) {
        var $tmp = jQuery(e.target).find(".viewGrid");
        if($tmp.length){ $tmp.css({ "grid-template-columns": nC, "grid-template-rows": nR }); }
      });
    }

    function myResize(){
      $('.qvobjectMod').each(function(key, value){
        $(this).width() < 400 ?  $(this).parent().find('.chartNavLabel').hide() : $(this).parent().find('.chartNavLabel').show();
      })
    }

    function loadCss(url) {
      var link = document.createElement("link");
      link.type = "text/css"; link.rel = "stylesheet"; link.href = url;
      document.getElementsByTagName("head")[0].appendChild(link);
    }

    function toggleSideBarDesktop(){
      var sl, sr;
        $('#sidebar-right').is(':visible')? sr= "sr": sr= "main";
        $('#sidebar-left').is(':visible')? sl= "sl": sl= "main";
      $('#container').css('grid-template-areas','"header header header""'+sl+' main '+sr+'""footer footer footer"');
    }

    function toggleSideBarMobile(){
      var sb;
      if($('#sidebar-left').is(':visible') && !$('#sidebar-right').is(':visible')){
          sb= "sl";  $('#content').hide();
      } else if(!$('#sidebar-left').is(':visible') && $('#sidebar-right').is(':visible')){
          sb= "sr"; $('#content').hide();
      } else { sb= "main"; $('.sidebar').hide(); $('#content').show(); }
      $('#container').css('grid-template-areas','"header header "" '+sb+' '+sb+'""footer footer "');
    }

    function toggleSideBar(toggleWhat){
      if($( document ).width() < 601){
        $('#sidebar-'+toggleWhat).is(':visible')  ? 	$('#sidebar-'+toggleWhat).hide():$('#sidebar-'+toggleWhat).show();
        toggleSideBarMobile();
      } else {
        $('#sidebar-'+toggleWhat).is(':visible')  ? 	$('#sidebar-'+toggleWhat).hide():$('#sidebar-'+toggleWhat).show();
        toggleSideBarDesktop();
      }
      myResize(); qlik.resize();
    }

    function filterGroupControll(controll, special){
      if(myConfig.sidebar.settings.allwaysShowAllFilterGroups != true){

        $('.filterGroupNav i').removeClass('active');

        switch (controll){
          case 'regular':
            $('.specialFiltericon, .specialFilter').hide();
            $('.dashboardFiltericon, .dashboardFilter').hide();
            $('.regularFiltericon, .regularFilter:first').show();
            $('.regularFiltericon:first').addClass('active');
          break;

          case 'dashboard':
            if ($('.dashboardFilter').length > 0) {
              $('.specialFiltericon, .specialFilter').hide();
              $('.regularFiltericon, .regularFilter').hide();
              $('.dashboardFiltericon, .dashboardFilter').show();
              $('.dashboardFiltericon:first').addClass('active');
            }
          break;
        }

        if($('.'+special+'Filtericon').length > 0){
          $('.filterGroupNav i').removeClass('active');
          $('.sidegroup').hide();
          $('.'+special+'Filtericon, .'+special+'Filter').show();
          $('.'+special+'Filtericon:first').addClass('active');
        }

        qlik.resize();
      }
    }

    function loadStart(){ $('#innerOverlay').fadeIn(); $('#content').hide(); }

    function loadFinish(){
      if($('#Overlay').is(':visible')){
        $('#Overlay').delay(6000).fadeOut(1000, function(){ $('#innerOverlay').fadeOut(500);  });
      } else { $('#innerOverlay').hide(); }
      $('#OverlayTitle').hide();
      $('#content').fadeIn(1000);
      myResize();
    }

    function initApp(){


      let views = [];
      let analyserLinks = '';
      let defView = '';
      let qvToolBar = createElement('div','qvToolbar');
      let backIcon = createElement('i', myConfig.sidebar.settings.icons.qvToolbarBack);
      let forwardIcon = createElement('i', myConfig.sidebar.settings.icons.qvToolbarForward);
      let clearIcon = createElement('i', myConfig.sidebar.settings.icons.qvToolbarClear);
      let cr = createElement('div', 'hideObject');
      let toggleSidebarLeft = createElement('i', myConfig.sidebar.settings.icons.leftSideBarIcon + ' toggleSide');
      let toggleSidebarRight = createElement('i', myConfig.sidebar.settings.icons.rightSideBarIcon + ' toggleSide');
      let toggleHelp = createElement('i', myConfig.sidebar.settings.icons.helpIcon);

      let nav ='<ul>';
      nav += '<li><a id="dashboardlink" href="#!/"><i class="fas fa-tachometer-alt fa-fw"></i> <span class="lScreen">Dashboard</span></a></li>';
      nav += '<li><a id="analyserlink" href=""><i id="analyserIcon" class="fas fa-desktop fa-fw"></i> <span class="lScreen">Analyser<span id="curviewport"></span></span></a>';
      nav += '<ul id="analyserViews"></ul></li></ul>';
      $('#nav').append(nav);

      /*
        Overwrite Colortheme by Config */
      if(myConfig.globalSettings.colortheme != undefined){
        $('head').append('<link rel="stylesheet" href="assets/css/'+myConfig.globalSettings.colortheme +'.css">')
      }

      /*
        Sidebars */
      $('#sidebarmenu').append(toggleSidebarLeft);
      $('#sidebarmenu').append(toggleSidebarRight);
      $('#sidebarmenu').append(toggleHelp);

      $(toggleSidebarLeft).on('click',	function(){ toggleSideBar('left'); qlik.resize()  });
      $(toggleSidebarRight).on('click', function(){ toggleSideBar('right'); qlik.resize() });
      $(toggleHelp).on('click', function() { $( ".bnHelp" ).toggle(); });


      $( window ).resize(function() {
        if($( document ).width() < 601){
          toggleSideBarMobile();
          $('#analyserlink').attr('href', '');

        } else {

          toggleSideBarDesktop()
          $('#content').show();
        }
        myResize();
      });

      gridControll();

      // Add QV Toolbar
      $(clearIcon).on('click', function(){ if ( !app ) { app = getQlikApp(); } app.clearAll(); });
      $(forwardIcon).on('click', function(){ if ( !app ) { app = getQlikApp(); } app.forward(); });
      $(backIcon).on('click', function(){ if ( !app ) { app = getQlikApp(); } app.back(); });

      $(qvToolBar).append(backIcon);
      $(qvToolBar).append(clearIcon);
      $(qvToolBar).append(forwardIcon);
      $('#footer').append(qvToolBar);



      let css = '';
      /* Generate Analyser Links for Nav */
      myConfig.analyser.views.forEach(function(view) {
        var analyserSubLinks = '';
        if(view.isSubView != true){

          var subViewCounter = 0;
          myConfig.analyser.views.forEach(function(subview) {
            if(subview.isSubView == true && subview.linkToViewId == view.id && subview.showLinkInHeader == true) {
              analyserSubLinks += '<li><a class="'+ subview.id +'" href="#!/analyser/'+ subview.id +'"><i class="'+subview.icon+' fa-fw"></i> <span class="">'+ subview.label +'</span></a></li>'
              subViewCounter++;
            }
          });

          if(subViewCounter > 0){
              var label = view.label;
              view.subViewlabel != undefined ? label = view.subViewlabel : label = view.label;
              analyserLinks += '<li><a class="'+ view.id +' hasSubs" href=""><i class="'+view.icon+' fa-fw"></i> <span class="lScreen">'+ label  +'</span><i style="float:right" class="fas fa-angle-right navright"></i></a>'
              analyserLinks += '<ul>';
              analyserLinks += '<li><a class="'+ view.id +'" href="#!/analyser/'+ view.id +'"><i class="'+view.icon+' fa-fw"></i> <span class="">'+ view.label +'</span></a></li>'
              analyserLinks += analyserSubLinks;
              analyserLinks += '</ul></li>';
          } else {
            analyserLinks += '<li><a class="'+ view.id +'" href="#!/analyser/'+ view.id +'"><i class="'+view.icon+' fa-fw"></i> <span class="lScreen">'+ view.label +'</span></a>'
          }
          if(defView == '' && myConfig.analyser.settings.showCurrentNextAnalyser == true) defView = ': ' + view.label;
        }

        if(myConfig.analyser.settings.useViewColorsInNav ==true){
            css += '<style type="text/css">';
            if(view.color != undefined){
                var color = view.color
                if(view.colorOverwriteNav != undefined) {
                  color = view.colorOverwriteNav;
                }
                css +=  '#nav a.'+view.id + '{ color:'+color+';}';
            }

            if(view.bgColor != undefined){
              css +=  '#nav a.'+view.id + '{ background-color:'+view.bgColor+';}';
            }

            css += '</style>';
        }

      });
      $('head').append(css)


      if(myConfig.analyser.settings.ReplaceAnalyserLink == true){
          analyserLinks = '<ul><li><a id="dashboardlink" href="#/"><i class="fas fa-tachometer-alt fa-fw"></i> <span class="lScreen">Dashboard</span></a></li>' + analyserLinks + '</ul>';
          $('#nav').html(analyserLinks);
          $('#nav a').removeClass('active');
      } else {
          $('#curviewport').html(defView);
          $('#analyserViews').html(analyserLinks)
      }

      if(myConfig.analyser.settings.showAlwaysOnlyIconInHeader ==  true){
        $('.lScreen').hide();
      }

      $(cr).attr('title','CopyRight');
      $(cr).html('CopyRightText');

      $('body').append(cr);
      $('#footerText').on('click', function(){$(cr).dialog();});
      qlik.resize();
    }

    return {
        getQlikApp: getQlikApp
        , buildSAy2y: buildSAy2y
        , formatNumber: formatNumber
        , gridControll: gridControll
        , loadCss: loadCss
        , createElement: createElement
        , setChild: setChild
        , setVariable: setVariable

        , checkMobile: checkMobile
        , copyInputToClipboard: copyInputToClipboard
        , hex2rgb: hex2rgb
        , rgb2hex: rgb2hex
        , rgb2hsl: rgb2hsl
        , hsl2rgb: hsl2rgb
        , hue2rgb: hue2rgb

        , createSlider:createSlider
        , createButtons: createButtons
        , createDropDown: createDropDown
        , createInput: createInput
        , createCalBox: createCalBox

        , initApp: initApp
        , toggleSideBarDesktop: toggleSideBarDesktop
        , toggleSideBarMobile: toggleSideBarMobile
        , toggleSideBar: toggleSideBar
        , myResize: myResize
        , loadStart: loadStart
        , loadFinish: loadFinish
        , filterGroupControll: filterGroupControll


    };
});
