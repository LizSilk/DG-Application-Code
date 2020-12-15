

var iframe = document.getElementById("203407869834061");

iframe.addEventListener("load", function() {

    var buttonDiv1 = iframe.contentWindow.document.getElementById("text_279");
    buttonDiv1.innerHTML = "<button id=\"lookup-button-1\" type=\"button\">\n"
        + "Check Inverter Model\n" + "</button>"
        + "<div id=\"lookup-output-1\" data-component = \"text\">" +"</div>";
    var button1 = iframe.contentWindow.document.getElementById("lookup-button-1");
    button1.addEventListener("click",function(){lookup("input_69","lookup-output-1","input_298")});
    iframe.contentWindow.document.getElementById('input_298').value=0;
    iframe.contentWindow.document.getElementById('input_298').dispatchEvent(new Event('change'));

    var button2 = iframe.contentWindow.document.getElementById("form-pagebreak-next_282");
    button2.addEventListener("click",function(){lookup("input_150","text_281")});

    var button3 = iframe.contentWindow.document.getElementById("form-pagebreak-next_283");
    button3.addEventListener("click",function(){lookup("input_160","text_285")});

    var button4 = iframe.contentWindow.document.getElementById("form-pagebreak-next_284");
    button4.addEventListener("click",function(){lookup("input_220","text_286")});
});

function lookup(inputID,outputID,backendID){
    var elmnt = iframe.contentWindow.document.getElementById(inputID).value;
    var form = new FormData();
    form.append('ModelNum',elmnt.trim())
    Http = new XMLHttpRequest();
    url = 'http://127.0.0.1:5000';
    Http.open("POST", url, true);
    Http.send(form);
    Http.onreadystatechange = (e) => {
        if(Http.responseText=="0"){
            iframe.contentWindow.document.getElementById(backendID).value=0;
            iframe.contentWindow.document.getElementById(backendID).dispatchEvent(new Event('change'));
            iframe.contentWindow.document.getElementById(outputID).innerHTML = "<p>" +
                "The inverter model you have entered is not on the Clean Energy Council's list of improved inverters.\n Powerco will not accept this application unless the inverter is on this list. It can be found "
                +"<a href=\"http://www.cleanenergyregulator.gov.au/DocumentAssets/Pages/CEC-approved-inverters.aspx\" target=\"_blank\">here.</a>"+"</p>";
        }
        else{
            iframe.contentWindow.document.getElementById(backendID).value=1;
            iframe.contentWindow.document.getElementById(backendID).dispatchEvent(new Event('change'));
            iframe.contentWindow.document.getElementById(outputID).innerHTML = "<p>" +
                "The inverter model you have entered is on the Clean Energy Council's list of improved inverters. This list can be found "
                +"<a href=\"http://www.cleanenergyregulator.gov.au/DocumentAssets/Pages/CEC-approved-inverters.aspx\" target=\"_blank\">here.</a>" + "</p>";
        }
        console.log(Http.responseText)
    }
}