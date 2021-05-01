
        $(function(){
            $('#input-name').autoComplete({
                minChars: 1,
                source: function(term, suggest){
                    term = term.toLowerCase();
                    var choices = ['Windows on Europe', 'myfoglio Gmbh', 'Augustea Holding', 'Virtual Content Group (VCG)', 'Harvard Business Review', 'Translink Corporate Finance', 'Digital Sales International', 'My Own Biz', 'Universit� degli Studi di Roma Foro Italico', 'YetiZen', 'Red Hat', 'JumpStartFund', 'Bazeel - Acme srl', 'Mind the Bridge', 'The Global Capital Law Group & The Global Capital Strategic Group', 'Nana Bianca', 'Aktive Reply', 'Azimut', 'GrainSense', 'Innov azione magazine', 'Iubenda', 'adacado inc.', 'Big Tags', 'MiSiedo s.r.l', 'BITAGE', 'LDV Capital', 'MDSWORLD Inc.', 'TORI Consulting', 'Banzai Spa', 'Arka ServiceL', 'Awhy'];
                    var suggestions = [];
                    for (i=0;i<choices.length;i++)
                        if (~choices[i].toLowerCase().indexOf(term)) suggestions.push(choices[i]);
                    suggest(suggestions);
                }
            });
          $('#advanced-demo').autoComplete({
                  minChars: 0,
                source: function(term, suggest){
                    term = term.toLowerCase();
                    var choices = [['Australia', 'au'], ['Austria', 'at'], ['Brasil', 'br'], ['Bulgaria', 'bg'], ['Canada', 'ca'], ['China', 'cn'], ['Czech Republic', 'cz'], ['Denmark', 'dk'], ['Finland', 'fi'], ['France', 'fr'], ['Germany', 'de'], ['Hungary', 'hu'], ['India', 'in'], ['Italy', 'it'], ['Japan', 'ja'], ['Netherlands', 'nl'], ['Norway', 'no'], ['Portugal', 'pt'], ['Romania', 'ro'], ['Russia', 'ru'], ['Spain', 'es'], ['Swiss', 'ch'], ['Turkey', 'tr'], ['USA', 'us']];
                    var suggestions = [];
                    for (i=0;i<choices.length;i++)
                        if (~(choices[i][0]+' '+choices[i][1]).toLowerCase().indexOf(term)) suggestions.push(choices[i]);
                    suggest(suggestions);
                },
                renderItem: function (item, search){
                    search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                    var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
                    return '<div class="autocomplete-suggestion" data-langname="'+item[0]+'" data-lang="'+item[1]+'" data-val="'+search+'"><img src="img/'+item[1]+'.png"> '+item[0].replace(re, "<b>$1</b>")+'</div>';
                },
                onSelect: function(e, term, item){
                    console.log('Item "'+item.data('langname')+' ('+item.data('lang')+')" selected by '+(e.type == 'keydown' ? 'pressing enter or tab' : 'mouse click')+'.');
                    $('#advanced-demo').val(item.data('langname')+' ('+item.data('lang')+')');
                }
            });
        });

             // ATOKA
    var atokaUrl = "https://api.atoka.io/v2/companies";

    // find elements
    var inputToken = $('#input-token');
    var inputPiva = $('#input-vat');
    var inputName = $('#input-name');
    // var inputFuzzy = $('#input-fuzzy');
    // var inputConf = $('#input-confidence');

    $().cl

    function doMatchRequest(callback) {
      // GET request to Atoka Companies Search, with only PIVA in input
      $.get(atokaUrl + '/match', {
        token: inputToken.val(),
        regNumbers: inputPiva.val(),
        name: inputName.val(),
        // fuzziness: inputFuzzy.val(),
        // minConfidence: inputConf.val(),
      }).done(callback);
    }

    function doDetailsRequest(companyId, callback) {
      // Downloads data for a single company, from packages base contacts and web
      $.get(atokaUrl + '/' + companyId, {
        token: inputToken.val(),
        packages: 'base,contacts,web',
      }).done(callback);
    }


    // handle click and add class
    $('#match-button').on('click', function() {
      var token = inputToken.val("da703c91-4b82-44bc-83bc-d5e3cb78c303-e");
      $('#results').remove();


      
      doMatchRequest(function(data) {
        // show results of match
        let results = data.items.map(function(item) {
          let label = `${item.name} <small>(${item.confidence * 100}%)</small><br/><small>${item.fullAddress}</small>`;
          return $(`<li><input type="radio" name="company" value="${item.id}" />${label}</li>`);
        });

        var resBlock = $('<ul id="results">');
        resBlock.addClass('block-content').html(results);
        resBlock.append($('<button id="download-button">Download Data</button>'));
        resBlock.append('<br/><small>This call will cost 1 credit companies:*</small>');
        $('#form').after(resBlock);
        $('#download-button').on('click', downloadData);
      });
    });

    function downloadData() {
      var checked = $("input[name='company']:checked", '#results').val();
      
      doDetailsRequest(checked, function(data) {
        var result = $('<div>');
        result.addClass('block-content');

        result.append($(`<div>VAT: ${data.item.base.vat}</div>`));

        // show first phone only if present
        if (data.item.contacts && data.item.contacts.phones) {
          result.append($(`<div>PHONE: ${data.item.contacts.phones[0].number}</div>`));
        }

        // show first website only if present
        if (data.item.web && data.item.web.websites) {
          var website = data.item.web.websites[0].url;
          result.append($(`<div>WEB: <a target="_blank" href="${website}">${website}</a></div>`));
        }
        $('#results').after(result);
      });
    }
