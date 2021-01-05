/**
 * This script looks up the ICP to confirm it is valid
 * It sends a http request to the python server, and updates the HTML to give the user an answer
 * This script must be run AFTER inverter_request.js as it declares the IFRAME element
 */
////the iframe container - not needed as it is declared by inverter_request.js
//let IFRAME = document.getElementById("203407869834061");

/**
 * Event lister used so that elements are only accessed after they are loaded
 */
IFRAME.addEventListener("load", function() {
    let icp_input = IFRAME.contentWindow.document.getElementById("input_264");

    //add button to the HTML
    let buttonDiv = IFRAME.contentWindow.document.getElementById("text_303");
    buttonDiv.innerHTML = "<button id=\"lookup-button-icp\" type=\"button\">\n"
        + "Check ICP Number\n" + "</button>"
        + "<div id=\"lookup-output-icp\" data-component = \"text\">" +"</div>";
    let button = IFRAME.contentWindow.document.getElementById("lookup-button-icp");

    //update background field used to hide page break - the event is needed so the form realises its been changed
    IFRAME.contentWindow.document.getElementById('input_304').value=0;
    IFRAME.contentWindow.document.getElementById('input_304').dispatchEvent(new Event('change'));

    /**
     * This function is responsible for sending the ICP number to the python server
     * When it gets a response it updates the HTML and fills in the address fields
     * Implemented in the event listener rather than a discrete function that made the event listener act up
     */
    button.addEventListener("click",function (){
        //send request to python server
        let form = new FormData();
        form.append('ICPNum',icp_input.value.trim())
        let Http = new XMLHttpRequest();
        let url = window.location.origin +"/icp"
        Http.open("POST", url, true);
        Http.send(form);
        //wait for response
        Http.onreadystatechange = (e) => {
            console.log(Http.responseText)
            //if the icp was valid
            if(Http.status != 400 && Http.status!= 0 ){
                IFRAME.contentWindow.document.getElementById("lookup-output-icp").innerHTML = "<p>" +
                   "The ICP number you have entered is valid!" +"</p>"
                let json = JSON.parse(Http.responseText)
                //fill in address
                IFRAME.contentWindow.document.getElementById("input_39_addr_line1").value=json.PhysicalAddressNumber +" "+ json.PhysicalAddressStreet
                IFRAME.contentWindow.document.getElementById("input_39_addr_line2").value=json.PhysicalAddressSuburb
                IFRAME.contentWindow.document.getElementById("input_39_city").value=json.PhysicalAddressTown
                IFRAME.contentWindow.document.getElementById("input_39_state").value=json.PhysicalAddressRegion
                IFRAME.contentWindow.document.getElementById("input_39_postal").value=json.PhysicalAddressPostCode
                update_backend('input_304',2)
           }
           else if(Http.status==0){
               IFRAME.contentWindow.document.getElementById("lookup-output-icp").innerHTML = "<p>" +
                   "We couldn't connect to our server. Please make sure the ICP number is correct before proceeding"
                   +"</p>"
                update_backend('input_304',-2)
           }
           //if the ICP was invalid
           else{
               IFRAME.contentWindow.document.getElementById("lookup-output-icp").innerHTML = "<p>" +
                   "The ICP number you have entered is invalid. Please check you have entered it correctly." +"</p>"
                //updates field for the conditional logic of the form - the event is needed so the form realises its been changed
                update_backend('input_304',0)
            }
        }
    });
});