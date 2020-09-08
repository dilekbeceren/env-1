var modalTemplate = `
<div class="modal fade" id="modalTemplate" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
  aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalLabel">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
`

function getButtonGroupTemplate(id) {
  return `
            <button class="glyphicon glyphicon-minus hide" onclick="onSubItemsCloseClick(this,` + id + `)"></button>
            <button class="glyphicon glyphicon-plus" onclick="onSubItemsOpenClick(this,` + id + `)"></button>
            <button class="hide loading" disabled>
              Loading...
            </button>
`;
}

(function ($) {
  $.fn.tableCreator = function (options) {
    // default arguments
    options = $.extend({
      data: [],
      columns: [],
    }, options);

    this.append(modalTemplate);

    var table = $('<table></table>').addClass('table');

    var thead = $('<thead></thead>').addClass('palette palette-turquoise');
    table.append(thead);

    var tbody = $('<tbody></tbody>').addClass('palette palette-clouds');
    table.append(tbody);

    var tr_thead = $('<tr></tr>');
    thead.append(tr_thead);
    $.each(options.columns, function (i, item) {
      tr_thead.append($('<th></th>').attr('scope', 'col').append(item));
    });

    $.each(options.data, function (i, item) {
      var wrapper_tr = $('<tr></tr>');
      $.each(Object.keys(options.columns), function (i, column) {
        wrapper_tr.append(
          $('<td></td>').append(
            i === 0 ?
              $('<div></div>')
                .addClass('row')
                .append($('<div></div>').addClass('col-xs-2').append(getButtonGroupTemplate(item[options.key])))
                .append($('<div></div>').addClass('col-xs-10').append(item[column]))
              :
              $('<a></a>').attr('href', '#').attr('onclick', "onModalClick('" + item[column] + "','" + column + "')").append(item[column])
          )
        );
      });
      tbody.append(wrapper_tr);
    });

    this.append(table);
    return this;
  };
}(jQuery));

function addSubItems(root, key, data) {
  $.each(data, function (i, item) {
    var wrapper_tr = $('<tr></tr>').attr('item-id', key);
    $.each(item, function (key, subItem) {
      if(key === 'name') {
        wrapper_tr.append($('<td></td>').addClass('text-align-end').append(subItem));
      } else {
        wrapper_tr.append($('<td></td>').append($('<a></a>').attr('href', '#').attr('onclick', "onModalClick('" + subItem + "','" + key + "')").append(subItem)));
      }
    });
    root.after(wrapper_tr);
  });

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function onModalClick(key, modal) {

  var template = $('#modalTemplate');

  switch(modal) {
    case 'tckn':
      template.find('.modal-body').html(key + ' User Detail...');
      template.find('#modalLabel').html('Detail');
      break;
    case 'phone':
      template.find('.modal-body').html(key + ' Call..');
      template.find('#modalLabel').html('Phone');
  }

  template.modal('show');
}

async function onSubItemsOpenClick($this, key) {
  $($this).toggleClass('hide');

  var foundedElements = $("[item-id=" + key + "]");
  if(foundedElements.length > 0) {
    $.each(foundedElements, function (i, item) {
      $(item).toggleClass('hide');
    });
  } else {
    var loading = $($this).closest('div').find('.loading');
    loading.toggleClass('hide');

    //simulate backend fetch
    await sleep(2000);
    addSubItems($($this).closest('tr'), key, [
      {
        "name": "Gökhan Türkmen",
        "tckn": "12345678901",
        "phone": "02333453422"
      },
      {
        "name": "Fatma Turunç",
        "tckn": "12345678902",
        "phone": "02321111111"
      },
      {
        "name": "Deneme Deneme",
        "tckn": "12345678903",
        "phone": "02321111111"
      }
    ]);
    loading.toggleClass('hide');
  }
  $($this).closest('div').find('.glyphicon-minus').toggleClass('hide');
}

function onSubItemsCloseClick($this, key) {
  $.each($("[item-id=" + key + "]"), function (i, item) {
    $(item).toggleClass('hide');
  });

  $($this).toggleClass('hide');
  $($this).closest('div').find('.glyphicon-plus').toggleClass('hide');
}
