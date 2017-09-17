$(document).ready(function() {
    $.fn.insert = function(content) {
        var clone = content.clone();
        clone.appendTo(this);
    }

    $item = $(".item");
    $loading = $(".loading-wrapper");
    $table = $(".exotics");
    $content = $(".exotics tbody");
    $screenshot = $(".screenshot-image");

    bungie_url = "https://bungie.net";
    
    timeout = 5;
    length = armory.length;

    function loading_step(i) {
        if (i >= length) {
            init_table();
            return;
        }

        build_item(i);

        setTimeout(function() {
            loading_step(i+1);
        }, timeout);
    }

    function build_item(id) {
        item = armory[id];

        $item.find(".name .ru").html(item.namerus);
        $item.find(".name .en").html(item.nameeng);
        $item.find(".type .ru a").html(item.typerus.replace('Экзотический ',''));
        $item.find(".type .en a").html(item.typeeng.replace('Exotic ',''));
        $item.find(".description .ru").html(item.descrus);
        $item.find(".description .en").html(item.desceng);
        $item.find(".icon img").attr("src", bungie_url + item.icon);
        
        $content.insert($item);
    }

    function init_table() {
        $table.DataTable({
            "autoWidth": true,
            "paging": false,
            "fixedHeader": true,
            "initComplete": function(settings, json) {
                $('input[type="search"]').appendTo(".dataTables_filter");
                $(".dataTables_filter label").remove();
                $loading.fadeOut();
                $(".type a").click(function(e) {
                    e.preventDefault();
                    $(".dataTables_filter input").val($(this).html());
                    $(".dataTables_filter input").trigger("search");
                });
            },
            "order": [[ 1, 'asc' ]],
            "columnDefs": [
                { "orderable": false, "targets": 0 }
            ]
        });
    }

    loading_step(0);
});
