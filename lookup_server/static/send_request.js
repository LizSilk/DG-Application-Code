/**
 * This script looks up the inverter to confirm it is approved
 * It sends a http request to the python server, and updates the HTML to give the user an answer
 * This script must be run before icp_request.js as it declares the IFRAME element
 */

//the iframe container
const IFRAME = document.getElementById("203407869834061");

/**
 * Event lister used so that elements are only accessed after they are loaded
 */
IFRAME.addEventListener("load", function() {
    makeButton(1,"text_279","input_69","input_298")
    makeButton(2,"text_281","input_150","input_305")
    makeButton(3,"text_285","input_160","input_306")
    makeButton(4,"text_290","input_220","input_307")

});

/**
 * This function is used to create the 'Check Inverter Button' buttons in the HTML
 * I made it a function as I did not want to have to repeat the code four times
 * @param num the number of the inverter i.e. is it the first/second/third inverter on the form
 * @param textID the id of the paragraph element that will be overwritten with the button
 * @param inputID the ID of the input field for the inverter model
 * @param backendID the id of the hidden field that lets me hide the page break
 */
function makeButton(num, textID, inputID,backendID){
    const buttonDiv = IFRAME.contentWindow.document.getElementById(textID);
    buttonDiv.innerHTML = "<button id=\"lookup-button-"+num+"\" type=\"button\">\n"
        + "Check Inverter Model\n" + "</button>"
        + "<div id=\"lookup-output-"+num+"\" data-component = \"text\">" +"</div>";
    let button1 = IFRAME.contentWindow.document.getElementById("lookup-button-"+num);
    button1.addEventListener("click",function(){lookup(inputID,"lookup-output-"+num,backendID)});
    IFRAME.contentWindow.document.getElementById(backendID).value=0;
    IFRAME.contentWindow.document.getElementById(backendID).dispatchEvent(new Event('change'));
}

/**
 * this function is responsible for sending the inverter model number to the python server
 * When it receives a response, it updates the HTML to inform the user
 * @param inputID the ID of the input field for the inverter model
 * @param outputID the id of the paragraph the results will go in
 * @param backendID the id of the hidden field that lets me hide the page break
 */
function lookup(inputID,outputID,backendID){
    //send request to python server
    let elmnt = IFRAME.contentWindow.document.getElementById(inputID).value;
    let form = new FormData();
    form.append('ModelNum',elmnt.trim())
    Http = new XMLHttpRequest();
    url = window.location.origin + "/inverter"
    Http.open("POST", url, true);
    Http.send(form);
    //wait for response
    Http.onreadystatechange = (e) => {
        //if the model was not on the list of improved inverters
        if(Http.status== 0 || Http.status ==408 ){
            IFRAME.contentWindow.document.getElementById(backendID).value=2;
            IFRAME.contentWindow.document.getElementById(backendID).dispatchEvent(new Event('change'));
            IFRAME.contentWindow.document.getElementById(outputID).innerHTML = "<p>" +
                "We could not connect to our servers. Please ensure that the inverter is on the CEC approved list, which can be found "
                +"<a href=\"http://www.cleanenergyregulator.gov.au/DocumentAssets/Pages/CEC-approved-inverters.aspx\" target=\"_blank\">here.</a>"+"</p>";
        }
        else if(Http.responseText=="0"){
            IFRAME.contentWindow.document.getElementById(backendID).value=0;
            IFRAME.contentWindow.document.getElementById(backendID).dispatchEvent(new Event('change'));
            IFRAME.contentWindow.document.getElementById(outputID).innerHTML = "<p>" +
                "The inverter model you have entered is not on the Clean Energy Council's list of improved inverters.\n Powerco will not accept this application unless the inverter is on this list. It can be found "
                +"<a href=\"http://www.cleanenergyregulator.gov.au/DocumentAssets/Pages/CEC-approved-inverters.aspx\" target=\"_blank\">here.</a>"+"</p>";
        }
        //if the model was on the list of improved inverters
        else{
            IFRAME.contentWindow.document.getElementById(backendID).value=2;
            IFRAME.contentWindow.document.getElementById(backendID).dispatchEvent(new Event('change'));
            IFRAME.contentWindow.document.getElementById(outputID).innerHTML = "<p>" +
                "The inverter model you have entered is on the Clean Energy Council's list of improved inverters. This list can be found "
                +"<a href=\"http://www.cleanenergyregulator.gov.au/DocumentAssets/Pages/CEC-approved-inverters.aspx\" target=\"_blank\">here.</a>" + "</p>";
        }
        console.log(Http.responseText)
    }
}