/**
 * This script looks up the inverter to confirm it is approved
 * It sends a http request to the python server, and updates the HTML to give the user an answer
 * This script must be run before icp_request.js as it declares the iframe element
 */

const iframe = document.getElementById("203407869834061");

iframe.addEventListener("load", function() {
    makeButton(1,"text_279","input_69","input_298")
    makeButton(2,"text_281","input_150","input_305")
    makeButton(3,"text_285","input_160","input_306")
    makeButton(3,"text_290","input_220","input_307")

});

function makeButton(num, textID, inputID,backendID){
    const buttonDiv = iframe.contentWindow.document.getElementById(textID);
    buttonDiv.innerHTML = "<button id=\"lookup-button-"+num+"\" type=\"button\">\n"
        + "Check Inverter Model\n" + "</button>"
        + "<div id=\"lookup-output-"+num+"\" data-component = \"text\">" +"</div>";
    let button1 = iframe.contentWindow.document.getElementById("lookup-button-"+num);
    button1.addEventListener("click",function(){lookup(inputID,"lookup-output-"+num,backendID)});
    iframe.contentWindow.document.getElementById(backendID).value=0;
    iframe.contentWindow.document.getElementById(backendID).dispatchEvent(new Event('change'));
}

function lookup(inputID,outputID,backendID){
    let elmnt = iframe.contentWindow.document.getElementById(inputID).value;
    let form = new FormData();
    form.append('ModelNum',elmnt.trim())
    Http = new XMLHttpRequest();
    url = 'http://127.0.0.1:5000/inverter';
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