var mode = getParameterByName('mode');
if (mode != 'csharp' && mode != 'php')
    mode = 'csharp';

var aboutName = '';
var aboutIntro = '';
if (mode == 'csharp') {
    aboutName = 'C# - FlexMessageConvert';
    aboutIntro =
        'Convert JSON structure to C# or ' +
        '<a href="index.html?mode=php">PHP</a>' +
        ' object.';
}
if (mode == 'php') {
    aboutName = 'PHP - FlexMessageConvert';
    aboutIntro =
        'Convert JSON structure to ' +
        '<a href="index.html?mode=csharp">C#</a>' +
        ' or PHP object.';
}

document.getElementsByClassName('about-name')[0].innerHTML = aboutName;
document.getElementsByClassName('about-intro')[0].innerHTML = aboutIntro;

var source = CodeMirror.fromTextArea(
    document.getElementById('source'), {
    lineWrapping: true,
    styleSelectedText: true
});

var result = CodeMirror.fromTextArea(
    document.getElementById('result'), {
    lineWrapping: true,
    styleSelectedText: true
});

var resultWarp = document.getElementsByClassName('result-warp')[0];
var error = document.getElementsByClassName('error')[0];

var showError = function (s) {
    resultWarp.style.display = 'none';
    error.style.display = 'none';
    setTimeout(function () {
        error.style.display = 'block';
        error.innerHTML = s;
    }, 200);
}

var showResult = function (s) {
    error.style.display = 'none';
    resultWarp.style.display = 'none';
    setTimeout(function () {
        resultWarp.style.display = 'block';
        result.setValue(s);
    }, 200);
}

var btn = document.getElementById('convert');
btn.onclick = function () {
    var input = source.getValue();
    if (input == "") {
        showError('Json string is empty.');
        return;
    }
    try {
        var output = '';
        if (mode == 'csharp')
            output = flexMessageConvertCSharp(input);
        if (mode == 'php')
            output = flexMessageConvertPHP(input);
        showResult(output);
    }
    catch (err) {
        showError('Failed: ' + err.message);
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}