$(document).ready(function() {
    /*==========
    / vars     =
    |=========*/

    var editor_enabled = false;
    var editor_pre = '<textarea class="builder-editor">';
    var editor_post = '</textarea>';
    var editor_tag = 'builder-editing';
    var $html = $('body').html();
    var buttons = [
        // buttons to add:
        // - plus
        // - gear
        // - minus
        // - header
        // - paragraph
        new Button()
    ];


    /*==========
    / classes  =
    |=========*/
    
    function Button(id, fa, selector, on_click) {
        this.id = id;
        this.fa = fa;
        this.selector = selector;
        this.on_click = on_click;
    }

    function Menu(buttons) {
        this.buttons = buttons;
    }


    /*==========
    / methods  =
    |=========*/

    function prepare_controls() {
        create_object_pool();
    }

    function add_button(id) {

    }

    function create_object_pool() {

    }

    function update_handlers() {
        $("h1, h2, h3, p, nav a").each(function() {
            $(this).click(enable_editor);
        });
    }


    /*==========
    / handlers =
    |=========*/

    function show_menu(on, where) {
        // set menu on_off
        // set menu position to
    }

    function enable_editor(event) {
        if (editor_enabled)
            disable_editor();

        $target = $(event.target);
        target_html = $target.html();
        target_html = editor_pre + target_html + editor_post;
        $target.html(target_html);
        $target.addClass(editor_tag);

        editor_enabled = true;
    }

    function disable_editor() {
        $target = $('.' + editor_tag);
        console.log($target);
        target_html = $target.html();
        console.log(target_html);
        target_html = target_html.replace(editor_pre, '');
        target_html = target_html.replace(editor_post, '');
        console.log(target_html);
        $target.html(target_html);
        $target.removeClass(editor_tag);
        $target = null;
        editor_enabled = false;
    }

    /*==========
    / main()   =
    |=========*/

    // prepare_controls();
    // update_handlers();


});