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
    makeButton(1,"text_279","input_69","input_298", "input_325" )
    makeButton(2,"text_281","input_150","input_305", "input_328")
    makeButton(3,"text_285","input_160","input_306", "input_327")
    makeButton(4,"text_290","input_220","input_307", "input_330")

});

/**
 * This function is used to create the 'Check Inverter Button' buttons in the HTML
 * @param num the number of the inverter i.e. is it the first/second/third inverter on the form
 * @param textID the id of the paragraph element that will be overwritten with the button
 * @param inputID the ID of the input field for the inverter model
 * @param backendID the id of the hidden field that lets me hide the page break
 */
function makeButton(num, textID, inputID,backendID, manufacturerID){
    const buttonDiv = IFRAME.contentWindow.document.getElementById(textID);
    buttonDiv.innerHTML = "<button id=\"lookup-button-"+num+"\" type=\"button\">\n"
        + "Check Inverter Model\n" + "</button>"
        + "<div id=\"lookup-output-"+num+"\" data-component = \"text\">" +"</div>";
    let button = IFRAME.contentWindow.document.getElementById("lookup-button-"+num);
    button.addEventListener("click",function(){lookup(inputID,"lookup-output-"+num,backendID, manufacturerID)});
    update_backend(backendID,0)
}

/**
 * this function is responsible for sending the inverter model number to the python server
 * When it receives a response, it updates the HTML to inform the user
 * @param inputID the ID of the input field for the inverter model
 * @param outputID the id of the paragraph the results will go in
 * @param backendID the id of the hidden field that lets me hide the page break
 * @param manufacturerID the id of the 'Inverter Manufacturer' field
 */
function lookup(inputID,outputID,backendID,manufacturerID){
    //send request to python server
    let input = IFRAME.contentWindow.document.getElementById(inputID).value;
    let Http = new XMLHttpRequest();
    let url = "https://jqtj47zn1d.execute-api.ap-southeast-2.amazonaws.com/default/inverter?ModelNum=" + input.trim()
    Http.open("POST", url, true);
    Http.send();
    //wait for response
    IFRAME.contentWindow.document.getElementById(outputID).innerHTML = "<p>" +"Loading... This could take up to twenty seconds"+".</p>";
    Http.onreadystatechange = (e) => {
        //if there was no response/couldn't connect
        if(Http.status== 0 || Http.status ==408  || Http.status == 404 || Http.status == 500){
            update_backend(backendID,2)
            IFRAME.contentWindow.document.getElementById(outputID).innerHTML = "<p>" +
                "We could not connect to our servers. Please ensure that the inverter complies with AS/NZS 4777.2:2020. A list of such inverters can be found "
                +"<u><a href=\"http://www.cleanenergyregulator.gov.au/DocumentAssets/Pages/CEC-approved-inverters.aspx\" target=\"_blank\">here</a></u>"+".</p>";
        }
        //if the model was not on the list of improved inverters
        else if(Http.status==400){
            update_backend(backendID,-1)
            IFRAME.contentWindow.document.getElementById(outputID).innerHTML = "<p>" +
                "The inverter model you have entered is not on our list of AS/NZS 4777.2:2020 compliant inverters.\nPowerco will not accept this application unless the inverter is compliant.\nPlease check you have formatted the name correctly - a list of such inverters can be found "
                +"<u><a href=\"http://www.cleanenergyregulator.gov.au/DocumentAssets/Pages/CEC-approved-inverters.aspx\" target=\"_blank\">here</a></u>"+".</p>";
        }
        //if the model was on the list but was expired
        else if(Http.status==503){
            update_backend(backendID,-1)
            IFRAME.contentWindow.document.getElementById(outputID).innerHTML = "<p>" +
                "The inverter model you have entered is on our list of AS/NZS 4777.2:2020 compliant inverters, but its certification has expired. \nIf you have a current certificate for this inverter, please upload it. \nA list of such inverters can be found "
                +"<u><a href=\"http://www.cleanenergyregulator.gov.au/DocumentAssets/Pages/CEC-approved-inverters.aspx\" target=\"_blank\">here</a></u>"+".</p>";
        }
        //if the model was on the list of improved inverters
        else{
            update_backend(backendID,2)
            update_backend(manufacturerID, Http.responseText)//misusing update_backend to fill in inverter manufacturer field
            IFRAME.contentWindow.document.getElementById(outputID).innerHTML = "<p>" +
                "The inverter model you have entered is on our list of AS/NZS 4777.2:2020 compliant inverters. " + "</p>";
        }
        console.log(Http.responseText)
    }
}

/**
 * This function is used to update the fields that let me interact with the form's logic
 * The event is needed so the form realises it's been changed
 * @param backendID the id of the field to change
 * @param value new value for the field
 */
function update_backend(backendID, value){
    IFRAME.contentWindow.document.getElementById(backendID).value=value;
    IFRAME.contentWindow.document.getElementById(backendID).dispatchEvent(new Event('change'));
}