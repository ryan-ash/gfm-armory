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
    $item_overlay = $(".item-overlay-wrapper");
    $item_lore = $item_overlay.find(".lore");
    $item_lore_en = $item_lore.find(".en");
    $item_lore_ru = $item_lore.find(".ru");
    $item_screenshot = $item_overlay.find(".screenshot");
    $item_screenshot_loading = $item_screenshot.find(".loading");
    $item_lang_en = $item_overlay.find(".language .en_switcher");
    $item_lang_ru = $item_overlay.find(".language .ru_switcher");
    $close_item_overlay = $(".close-item-overlay");

    bungie_url = "https://bungie.net";
    
    timeout = 5;
    length = armory.length;

    lore_dict = {}

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

        if (item.screenshot == "null")
            $item.attr("screenshot", "");
        else
            $item.attr("screenshot", bungie_url + item.screenshot);

        if (item.loreHash == "null" || !(item.loreHash in lore_dict))
            $item.attr("lorehash", "");
        else
            $item.attr("lorehash", item.loreHash);

        if (item.screenshot != "null" || item.loreHash != "null")
            $item.addClass("overlay-present");
        else
            $item.removeClass("overlay-present");
        
        $content.insert($item);
    }

    var ignore_item_overlay = false;

    function init_table() {
        $table.DataTable({
            "autoWidth": true,
            "paging": false,
            "fixedHeader": true,
            "initComplete": function(settings, json) {
                $search = $('input[type="search"]');
                $search.appendTo(".dataTables_filter");
                $search.attr("placeholder", "Search");
                $(".dataTables_filter label").remove();
                $loading.fadeOut();
                
                $(".type a").click(function(e) {
                    e.preventDefault();
                    $(".dataTables_filter input").val($(this).html());
                    $(".dataTables_filter input").trigger("search");
                    ignore_item_overlay = true;
                });

                $("tr.overlay-present").click(function(e) {
                    if (ignore_item_overlay) {
                        ignore_item_overlay = false;
                        return;
                    }

                    e.preventDefault();

                    lorehash = $(this).attr("lorehash");
                    screenshot_url = $(this).attr("screenshot");

                    lore_present = lorehash != "";
                    screenshot_present = screenshot_url != "";

                    if (lore_present) {
                        $item_overlay.addClass("lore-present");
                        $item_lore_en.html(lore_dict[lorehash]["en"]);
                        $item_lore_ru.html(lore_dict[lorehash]["ru"]);
                    } else {
                        $item_overlay.removeClass("lore-present");
                    }

                    if (screenshot_present) {
                        $item_overlay.addClass("screenshot-present");
                        $screenshot.attr("src", screenshot_url);
                        $item_screenshot_img = $item_screenshot.find("img");
                        if ($item_screenshot_img)
                            $item_screenshot_img.remove();

                        $item_screenshot.insert($screenshot);

                        $item_screenshot_loading.fadeIn('fast');
                        $item_screenshot_img = $item_screenshot.find("img");
                        $item_screenshot_img.on("load", function() {
                            $item_screenshot_loading.fadeOut('fast');
                            $item_screenshot_img.addClass("active");
                        });
                    } else {
                        $item_overlay.removeClass("screenshot-present");
                        $item_screenshot_img = $item_screenshot.find("img");
                        if ($item_screenshot_img)
                            $item_screenshot_img.remove();
                    }

                    $item_overlay.fadeIn();
                    $close_item_overlay.fadeIn();
                });
            },
            "order": [[ 1, 'asc' ]],
            "columnDefs": [
                { "orderable": false, "targets": 0 }
            ]
        });
    }

    $close_item_overlay.click(function(e) {
        $item_overlay.fadeOut();
        $close_item_overlay.fadeOut();
    });

    $item_lang_en.click(function(e) {
        e.preventDefault();
        $item_lore.addClass("original");
    });

    $item_lang_ru.click(function(e) {
        e.preventDefault();
        $item_lore.removeClass("original");
    });
        
    function prepare_lore() {
        for (hash in lore) {
            lore_item = lore[hash];
            if (lore_item["id"] == "" || lore_item["eng"] == "")
                continue;
            lore_dict[lore_item["id"]] = {"en": lore_item["eng"], "ru": lore_item["rus"]};
        }
        loading_step(0);
    }

    prepare_lore();
});
