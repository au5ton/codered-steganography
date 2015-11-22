//Index.js

var $mode_select = $('#mode_select');
var $encode_form = $('#encode_form');
var $decode_form = $('#decode_form');

$encode_form.hide();
$decode_form.hide();
disableEncodeForm();
disableDecodeForm();

var n = 0;

$mode_select.on('change', function(event){
    if(n === 0) {
        n++;
        $encode_form.show();
        $decode_form.show();
    }
    if(event.target.selectedIndex === 1) {
        enableEncodeForm();
        disableDecodeForm();
    }
    if(event.target.selectedIndex === 2) {
        disableEncodeForm();
        enableDecodeForm();
    }
});

$('#encode_password_protection').on('change', function(event) {
    if($(event.target).is(':checked') === true) {
        enableEncodePasswordField();
    }
    else {
        disableEncodePasswordField();
    }
});
$('#decode_password_protection').on('change', function(event) {
    if($(event.target).is(':checked') === true) {
        enableDecodePasswordField();
    }
    else {
        disableDecodePasswordField();
    }
});

function disableEncodeForm() {
    $encode_form.css('opacity',0.25);
    $('[name=\'encode_type\']').attr('disabled','');
    $('#encode_form .btn').addClass('disabled');
}

function enableEncodeForm() {
    $encode_form.css('opacity',1);
    $('[name=\'encode_type\']')[0].removeAttribute('disabled');
    $('#encode_form .btn').removeClass('disabled');
}

function disableDecodeForm() {
    $decode_form.css('opacity',0.25);
    $('[name=\'expected_type\']').attr('disabled','');
    $('#decode_form .btn').addClass('disabled');
}

function enableDecodeForm() {
    $decode_form.css('opacity',1);
    $('[name=\'expected_type\']')[0].removeAttribute('disabled');
    $('#decode_form .btn').removeClass('disabled');
}
