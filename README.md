# Distributed Generation Form Backend
 
This repository contains the backend code for the new form for attaching
Distributed Generation (DG) of up to 10kW application to the Powerco grid.
This form will be embedded in the Powerco website, and should greatly
simplify the application process.

The form itself has been created using JotForm, and will be embedded in page using an iframe. The JavaScript currently in /JavaScript
will be embedded in the page as well. These scripts then send http requests to some AWS Lambda functions, in order to verify the information entered by the user.

The code for this form is in four parts: icp_request.js, inverter_request.js, and two AWS lambda functions, icp_lookup and inverter, that are written in Python. There are several reasons for this, the most prominent being that the Electricity Authorities API cannot handle requests that originate from a browser, due to CORS (Cross-origin resource sharing). Other reasons are to help keep the API keys secret, and the difficulty of handling xlsx files using JavaScript. 

The code works by having the JavaScript embedded in the page containing the JotForm. It can then edit the form to add buttons and interact with the condition logic. When one of the buttons is pressed, the JavaScript file sends a HTTP request containing the information in the relevant field to the AWS Lambda functions. These functions then check if the input is valid, by sending a request to the ICP API maintained by the Electricity Authority, or by downloading the CEC’s (Clean Energy Council) list of approved inverters. A reply is then sent to the JavaScript, which again edits the JotForm with the new information. 

The form is currently hosted in an AWS S3 bucket.

**The JavaScript Files:**

inverter_request.js must be embedded in the page before icp_request.js. This is because it declares the IFRAME constant, which is used by both scripts. It also declares a helper method(update_backend) that both scripts use.
The scripts themselves are clearly commented, and should be simple enough to understand, even for someone with zero familiarity in JavaScript. I would recommend downloading the code and giving it a read. 

The scripts rely on event listeners to execute their code. When the page is loaded, they overwrite parts of the form to insert buttons. These buttons have event listeners attached that trigger other parts of the script when the button is pressed.

inverter_request.js starts by declaring the IFRAME constant – this is the container that includes the JotForm. It then adds an event listener to the iframe to wait until its loaded, and then call ‘makeButton’ four times, to create the four inverter lookup buttons. This works by using the IDs of the input, text to overwrite with the button, and a hidden field that allows the code to interact with the form’s logic. Theses ID’s are hardcoded, so if they are changed in the form the code will not work.

Each button has an event listener added to it, that calls the ‘lookup’ function when pressed. This is the function that sends a request to the Python server, and then displays the results.

icp_request.js works in a very similar way. It only adds a single button however, and its code is contained within the event listener itself, rather than a separate function. This is because the event listener acted strangely when handed a declared function.

**The AWS Lambda Functions:**

There are two functions that are used by this form, 'icp_lookup' and 'inverter'. These are hosted by AWS' Lambda service, which allows serverless deployment of code. They are both written in Python.

The 'inverter' function runs when a request comes into ‘https://jqtj47zn1d.execute-api.ap-southeast-2.amazonaws.com/default/inverter’. It downloads the CEC’s most recent list of approved inverters and checks if the model number that the incoming request contains is in this list. It also checks whether the model is past its expiry date, and sends a reply with the results.

The icp_inverter function runs when a request comes into ‘https://rb05bw3uug.execute-api.ap-southeast-2.amazonaws.com/default/icp_lookup’. It takes the ICP number contained in the incoming request and sends a request to the Electricity Authorities ICP API. If the ICP was valid, it sends a response to the JavaScript containing the address information and the energy retailer.

Both of these functions output their logs to AWS CloudWatch, which can be accessed from the 'Monitoring' tab of each function.