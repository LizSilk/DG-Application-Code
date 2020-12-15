var iframe = document.getElementById("203407869834061");

iframe.addEventListener("load", function() {

    var icp_input = iframe.contentWindow.document.getElementById("input_264");

    var buttonDiv = iframe.contentWindow.document.getElementById("text_303");
    buttonDiv.innerHTML = "<button id=\"lookup-button-icp\" type=\"button\">\n"
        + "Check ICP Number\n" + "</button>"
        + "<div id=\"lookup-output-icp\" data-component = \"text\">" +"</div>";
    var button = iframe.contentWindow.document.getElementById("lookup-button-icp");

    iframe.contentWindow.document.getElementById('input_304').value=0;
    iframe.contentWindow.document.getElementById('input_304').dispatchEvent(new Event('change'));

    button.addEventListener("click",function (){
        var form = new FormData();
        form.append('ICPNum',icp_input.value.trim())
        Http = new XMLHttpRequest();
        url = 'http://127.0.0.1:5000/icp';
        Http.open("POST", url, true);
        Http.send(form);
        Http.onreadystatechange = (e) => {
            console.log(Http.responseText)
            if(Http.status !== 400){
                iframe.contentWindow.document.getElementById("lookup-output-icp").innerHTML = "<p>" +
                   "The ICP number you have entered is valid!" +"</p>"
                var json = JSON.parse(Http.responseText)
                iframe.contentWindow.document.getElementById("input_39_addr_line1").value=json.PhysicalAddressNumber +" "+ json.PhysicalAddressStreet
                iframe.contentWindow.document.getElementById("input_39_addr_line2").value=json.PhysicalAddressSuburb
                iframe.contentWindow.document.getElementById("input_39_city").value=json.PhysicalAddressTown
                iframe.contentWindow.document.getElementById("input_39_state").value=json.PhysicalAddressRegion
                iframe.contentWindow.document.getElementById("input_39_postal").value=json.PhysicalAddressPostCode
                iframe.contentWindow.document.getElementById('input_304').value=1;
                iframe.contentWindow.document.getElementById('input_304').dispatchEvent(new Event('change'));
           }
           else{
               iframe.contentWindow.document.getElementById("lookup-output-icp").innerHTML = "<p>" +
                   "The ICP number you have entered is invalid. Please check you have entered it correctly." +"</p>"
            }
        }
    });
});