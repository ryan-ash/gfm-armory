$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
        var result = true;

        result = result && (filter_lore == filter_any_flag || filter_lore == data[4]);
        result = result && (filter_screenshot == filter_any_flag || filter_screenshot == data[5]);

        return result;
    }
);

var filter_any_flag = 0;
var filter_on_flag = 1;
var filter_off_flag = 2;

var filter_lore = filter_any_flag;
var filter_screenshot = filter_any_flag;

var table;

$(document).ready(function() {
    $.fn.insert = function(content) {
        var clone = content.clone();
        clone.appendTo(this);
    }

    var $item = $(".item");
    var $loading = $(".loading-wrapper");
    var $table = $(".exotics");
    var $content = $(".exotics tbody");
    var $screenshot = $(".screenshot-image");

    var $item_overlay = $(".item-overlay-wrapper");
    var $item_overlay_background = $(".item-overlay-background");
    var $item_lore = $item_overlay.find(".lore");
    var $item_lore_en = $item_lore.find(".en");
    var $item_lore_ru = $item_lore.find(".ru");
    var $item_screenshot = $item_overlay.find(".screenshot");
    var $item_screenshot_loading = $item_screenshot.find(".loading");
    var $item_lang_button = $item_overlay.find(".language");
    var $item_details_button = $item_overlay.find(".details");
    var $item_icon = $item_overlay.find(".icon");
    var $item_name_en = $item_overlay.find(".name .en");
    var $item_name_ru = $item_overlay.find(".name .ru");
    var $item_type_en = $item_overlay.find(".type .en");
    var $item_type_ru = $item_overlay.find(".type .ru");
    var $item_description_en = $item_overlay.find(".description .en");
    var $item_description_ru = $item_overlay.find(".description .ru");
    var $close_item_overlay = $(".close-overlay");
    var $next_item_overlay = $item_overlay.find(".next");
    var $previous_item_overlay = $item_overlay.find(".previous");
    
    var $filter_any = $(".filter-any");
    var $filter_on = $(".filter-on");
    var $filter_off = $(".filter-off");

    var bungie_url = "https://bungie.net";
    
    var timeout = 5;
    var length = armory.length;

    var lore_dict = {}

    var present_items = []

    var $last_opened_item;

    var ignore_item_overlay = false;

    var item_opened = false;

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
        var item = armory[id];

        var element_already_exists = present_items.indexOf(item.nameeng) != -1;

        if (element_already_exists)
            return;

        present_items.push(item.nameeng);

        $item.find(".name .ru").html(item.namerus);
        $item.find(".name .en").html(item.nameeng);
        $item.find(".type .ru a").html(item.typerus.replace('Экзотический ',''));
        $item.find(".type .en a").html(item.typeeng.replace('Exotic ',''));
        $item.find(".description .ru").html(item.descrus);
        $item.find(".description .en").html(item.desceng);
        $item.find(".icon img").attr("src", bungie_url + item.icon);

        var lore_present = item.loreHash != "null" && item.loreHash in lore_dict;
        var screenshot_present = item.screenshot != "null";

        if (screenshot_present) {
            $item.find(".screenshot-present").html(filter_on_flag);
            $item.addClass("screenshot-present");
            $item.attr("screenshot", bungie_url + item.screenshot);
        } else {
            $item.find(".screenshot-present").html(filter_off_flag);
            $item.removeClass("screenshot-present");
            $item.attr("screenshot", "");
        }
    
        if (lore_present) {
            $item.find(".lore-present").html(filter_on_flag);
            $item.addClass("lore-present");
            $item.attr("lorehash", item.loreHash);
        } else {
            $item.find(".lore-present").html(filter_off_flag);
            $item.removeClass("lore-present");
            $item.attr("lorehash", "");
        }

        if (screenshot_present || lore_present)
            $item.addClass("overlay-present");
        else
            $item.removeClass("overlay-present");
        
        $content.insert($item);
    }

    function init_table() {
        table = $table.DataTable({
            "autoWidth": true,
            "paging": false,
            "fixedHeader": true,
            "order": [[ 1, 'asc' ]],
            "columnDefs": [
                { "orderable": false, "targets": 0 }
            ],
            "initComplete": finish_table_handler,
        });
    }

    function finish_table_handler(settings, json) {
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

        $("tr.overlay-present").click(open_overlay_handler);
    }

    function open_overlay_handler(e) {
        if (ignore_item_overlay) {
            ignore_item_overlay = false;
            return;
        }

        e.preventDefault();

        $this = $(this);
        $last_opened_item = $this;

        $item_icon.css("background-image", "url(" + $this.find(".icon img").attr("src") + ")");
        $item_name_en.html($this.find(".name .en").html());
        $item_name_ru.html($this.find(".name .ru").html());
        $item_type_en.html($this.find(".type .en a").html());
        $item_type_ru.html($this.find(".type .ru a").html());
        $item_description_en.html($this.find(".description .en").html());
        $item_description_ru.html($this.find(".description .ru").html());

        lorehash = $this.attr("lorehash");
        screenshot_url = $this.attr("screenshot");

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

        item_opened = true;
        $item_overlay.css("display", "flex").hide().fadeIn();
        $item_overlay_background.fadeIn();
    }

    function filter_any_handler() {
        $this = $(this);
        $this.removeClass("filter-any");
        $this.addClass("filter-on");
        $this.off("click").click(filter_on_handler);
        apply_filter($this);
    }

    function filter_on_handler() {
        $this = $(this);
        $this.removeClass("filter-on");
        $this.addClass("filter-off");
        $this.off("click").click(filter_off_handler);
        apply_filter($this);
    }

    function filter_off_handler() {
        $this = $(this);
        $this.removeClass("filter-off");
        $this.addClass("filter-any");
        $this.off("click").click(filter_any_handler);
        apply_filter($this);
    }

    function prepare_lore() {
        for (hash in lore) {
            lore_item = lore[hash];
            if (lore_item["id"] == "" || lore_item["eng"] == "")
                continue;
            lore_dict[lore_item["id"]] = {"en": lore_item["eng"], "ru": lore_item["rus"]};
        }
        loading_step(0);
    }

    function apply_filter($filter) {
        var type = ($filter.attr("class").indexOf("lore") != -1) ? "lore" : "screenshot";

        var result = 0;
        
        if ($filter.hasClass("filter-any")) {
            result = filter_any_flag;
        } else if ($filter.hasClass("filter-on")) {
            result = filter_on_flag;
        } else if ($filter.hasClass("filter-off")) {
            result = filter_off_flag;
        }

        switch (type) {
            case "lore":
                filter_lore = result;
                break;
            case "screenshot":
                filter_screenshot = result;
                break;
        }

        table.draw();        
    }

    function open_next_available() {
        $next_item = $last_opened_item.next();
        
        if (!$next_item.length)
            $next_item = $content.find("tr:first-child");
        
        $last_opened_item = $next_item;
        
        if (!$next_item.hasClass("overlay-present"))
            return open_next_available();
        
        $next_item.click();
    }

    function open_prev_available() {
        $prev_item = $last_opened_item.prev();
        
        if (!$prev_item.length)
            $prev_item = $content.find("tr:last-child");
        
        $last_opened_item = $prev_item;

        if (!$prev_item.hasClass("overlay-present"))
            return open_prev_available();
        
        $prev_item.click();
    }

    $close_item_overlay.click(function(e) {
        item_opened = false;
        $item_overlay.fadeOut();
        $item_overlay_background.fadeOut();
    });

    $item_lang_button.click(function(e) {
        e.preventDefault();
        $item_overlay.toggleClass("original");
    });

    $item_details_button.click(function(e) {
        e.preventDefault();
        $item_overlay.toggleClass("hide-details");
    });

    $next_item_overlay.click(open_next_available);
    $previous_item_overlay.click(open_prev_available);

    $(window).keydown(function(e) {
        if (!item_opened)
            return;
        switch (e.key) {
            case "ArrowUp":
                e.preventDefault();
                open_prev_available();
                return;
            case "ArrowDown":
                e.preventDefault();
                open_next_available();
                return;
        }
    });

    $filter_any.click(filter_any_handler);
    $filter_on.click(filter_on_handler);
    $filter_off.click(filter_off_handler);

    prepare_lore();
});
