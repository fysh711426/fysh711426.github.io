var mode = getParameterByName('mode');
if (mode != 'csharp' && mode != 'php')
    mode = 'csharp';

var aboutName = '';
var aboutIntro = '';
if (mode == 'csharp') {
    aboutName = '[C#] FlexMessageConvert';
    aboutIntro =
        'Convert JSON structure to C# or ' +
        '<a href="index.html?mode=php">PHP</a>' +
        ' object.';
}
if (mode == 'php') {
    aboutName = '[PHP] FlexMessageConvert';
    aboutIntro =
        'Convert JSON structure to ' +
        '<a href="index.html?mode=csharp">C#</a>' +
        ' or PHP object.';
}

document.getElementsByClassName('about-name')
[0].innerHTML = aboutName;
document.getElementsByClassName('about-intro')
[0].innerHTML = aboutIntro;

var cm = CodeMirror.fromTextArea(
    document.getElementById('source'), {
    lineWrapping: true,
    styleSelectedText: true
});

var result = null;
var resultContent = document.getElementsByClassName('result-content')[0];
var btn = document.getElementById('convert');
btn.onclick = function () {
    var input = cm.getValue();
    if (input == "") {
        resultContent.style.display = 'none';
        alert('Json string is empty.');
        return;
    }
    try {
        var output = '';
        if (mode == 'csharp')
            output = flexMessageConvertCSharp(input);
        if (mode == 'php')
            output = flexMessageConvertPHP(input);
        if (resultContent.style.display == 'none') {
            resultContent.style.display = 'block';
            if (result == null) {
                result = CodeMirror.fromTextArea(
                    document.getElementById('result'), {
                    lineWrapping: true,
                    styleSelectedText: true
                });
            }
        }
        result.setValue(output);
    }
    catch (err) {
        resultContent.style.display = 'none';
        alert('[Failed] ' + err.message);
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