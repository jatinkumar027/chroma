// keyword toggle
var boldMode = false;
var keywordToggleBtn = document.getElementById('keyword-toggle')
const changeKeyword = () => {

    if(keywordToggleBtn.checked) {
        localStorage.setItem('chromaLiveHighlightBold', true)
        boldMode = true
    }
    else {
        localStorage.setItem('chromaLiveHighlightBold', '')
        boldMode = false
    }
    Chroma.setOptions({boldMode})
}
keywordToggleBtn.addEventListener('click', () => {
    
    changeKeyword()
})

const changeTheme = () => {
    let theme = document.getElementById('select-theme-dd').value
    localStorage.setItem('chromaLiveHighlightTheme', theme)
    Chroma.setOptions({theme})
    changeKeyword()
}
document.getElementById('select-theme-dd').addEventListener('change', changeTheme)

let theme = localStorage.getItem('chromaLiveHighlightTheme')
if(!theme)
    theme = 'dark'
Chroma.setOptions({theme : theme})
let convert = document.getElementById('convert')
const highlight = (lang) => {
    let userCode = document.getElementById('user-code').value
    let output = document.getElementById('output')
    output.innerHTML = Chroma.pretty(userCode, lang)
}
convert.addEventListener('click', () => {
    let lang = selectedLanguage()
    highlight(lang)
})
const selectedLanguage = () => {
    let lang = document.getElementById('language').value
    let savedLang = localStorage.getItem('chromaLiveHighlightLang')
    if(!savedLang)
        savedLang = lang
    return savedLang
}

document.getElementById('user-code').addEventListener('input', () => {
    let lang = selectedLanguage()
    highlight(lang)
})
document.getElementById('language').addEventListener('change', () => {
    let languageSelect = document.getElementById('language')
    localStorage.setItem('chromaLiveHighlightLang', languageSelect.value)
    let lang = selectedLanguage()
    highlight(lang)
})



// store locally
document.getElementById('clear-code').addEventListener('click', () => {
    document.getElementById('user-code').value = ''
    localStorage.setItem('chromaLiveHighlightCode', '')  
    localStorage.setItem('chromaLiveHighlightLang', 'sql')
    document.getElementById('output').innerText = ''
})

window.onload = () => {
    let bold = localStorage.getItem('chromaLiveHighlightBold')
    if(bold)
        keywordToggleBtn.checked = true
    else keywordToggleBtn.checked = false
    changeKeyword()
    // fix textarea width
    let textarea = document.getElementById('user-code') 
    textarea.focus() 
    let outputContainer = document.getElementById('output') 
    let refDiv = document.getElementById('reference-container')
    let height = refDiv.offsetHeight
    let width  = refDiv.offsetWidth
    if(document.body.offsetWidth > 800) {
        textarea.style.height = height - 8 + 'px'
        textarea.style.maxWidth = width/2 + 'px'
        outputContainer.style.height = height - 8 + 'px'
        outputContainer.style.width = width/2 + 'px'
    }
    else {
        textarea.style.height = '300px'
        outputContainer.style.height = document.body.offsetHeight - 60 + 'px'
        refDiv.style.width = width - 10 + 'px'
    }
    outputContainer.style.display = 'block'
    textarea.style.display = 'block'
    let savedCode = localStorage.getItem('chromaLiveHighlightCode')
    if(!savedCode)
        savedCode = document.getElementById('demo-code').innerText
    document.getElementById('user-code').value = savedCode
    let lang = selectedLanguage()
    let languageSelect = document.getElementById('language')
    let options = languageSelect.getElementsByTagName('option')
    for(i=0; i<options.length; i++) {
        if(options[i].value == lang)
            options[i].selected = true
        else options[i].selected = false
    }
    let themeSelect = document.getElementById('select-theme-dd')
    options = themeSelect.getElementsByTagName('option')
    for(i=0; i<options.length; i++) {
        if(options[i].value == theme)
            options[i].selected = true
        else options[i].selected = false
    }

    highlight(lang)
    setTimeout(() => {
        document.getElementById('loading-view').remove()
    }, 1000)
}
const storeCode  = () => {
    let code = document.getElementById('user-code').value
    if(code)
        localStorage.setItem('chromaLiveHighlightCode', code)


}
storeCode()
setInterval(storeCode, 5000)


// full screen trigger
let fullScreenModeBtn = document.getElementById('full-screen-mode')
fullScreenModeBtn.addEventListener('click', () => {
    let output = document.getElementById('output')
    output.requestFullscreen()
})

$("textarea").keydown(function(e)
{
    if (e.which == 9) //ASCII tab
    {
        e.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;
        var v = $(this).val();
        if (start == end)
        {
            $(this).val(v.slice(0, start) + "    " + v.slice(start));
            this.selectionStart = start+4;
            this.selectionEnd = start+4;
            return;
        }

        var selectedLines = [];
        var inSelection = false;
        var lineNumber = 0;
        for (var i = 0; i < v.length; i++)
        {
            if (i == start)
            {
                inSelection = true;
                selectedLines.push(lineNumber);
            }
            if (i >= end)
                inSelection = false;

            if (v[i] == "\n")
            {
                lineNumber++;
                if (inSelection)
                    selectedLines.push(lineNumber);
            }
        }
        var lines = v.split("\n");
        for (var i = 0; i < selectedLines.length; i++)
        {
            lines[selectedLines[i]] = "    " + lines[selectedLines[i]];
        }

        $(this).val(lines.join("\n"));
    }
});
$("textarea").keypress(function(e)
{
    if (e.which == 13) // ASCII newline
    {
        setTimeout(function(that)
        {
            var start = that.selectionStart;
            var v = $(that).val();
            var thisLine = "";
            var indentation = 0;
            for (var i = start-2; i >= 0 && v[i] != "\n"; i--)
            {
                thisLine = v[i] + thisLine;
            }
            for (var i = 0; i < thisLine.length && thisLine[i] == " "; i++)
            {

                indentation++;
             }
             $(that).val(v.slice(0, start) + " ".repeat(indentation) + v.slice(start));
             that.selectionStart = start+indentation;
             that.selectionEnd = start+indentation;  
}, 0.01, this);
     }
});