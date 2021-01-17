# Distributed Generation Form Backend
 
This repository contains the backend code for the new form for attaching
Distributed Generation (DG) of up to 10kW application to the Powerco grid.
This form will be embedded in the Powerco website, and should greatly
simplify the application process.

The form itself has been created using JotForm, and will be embedded in
page using an iframe. The JavaScript currently in lookup_server/static
will be embedded in the page as well. These scripts then send http requests
to the python server in order to verify the information entered by the user.

The python code that runs the server itself is all in lookup_server.py.
This file also currently creates a page for testing the form, though this
should be removed before deployment. The config files all currently use
the absolute paths on my machine, which will need to be changed before use.

The server performs two functions - an ICP number lookup, and an inverter
Model Number lookup. The ICP lookup uses the Electricity Authority's public
ICP api, while the inverter lookup uses the Clean Energy Council's list of
improved inverters.
