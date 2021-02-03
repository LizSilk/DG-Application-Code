# Distributed Generation Application Form Documentation

The form is designed to work in tandem with two JavaScript programs, icp_request.js & inverter_request.js, as well as a separate Python server. This code can currently be found here, or here if you don’t have access to the GitLab. The form has several elements that only exist for the code to interact with.  If for some reason the code is not embedded in the page, or is not run, these elements are hidden so that the user can still fill out the form without issue.


# Form/email Settings:

**Form Settings:**

•	Fields are automatically cleared on being hidden.
•	Browser AutoComplete enabled.
•	Error messages are set to default.
•	Save and fill out later enabled – email sent out with a link (currently sent from noreply@jotform.com - can be changed). It is important to note that this is found in the 'form settings’ section, not the ‘emails’ section.	

**Emails:**

•	The installer and customer emails are set to be sent to whatever email is entered in to these specific fields in the form. This is done in the ‘recepients’ section of the email.
•	The option to hide empty fields when email is enabled
•	Once applicant clicks ‘submit’ then emails will be sent down two different avenues:
    -	To the DG Admin DistributedGeneration@powerco.co.nz
    -	And to the CIW planning engineers: CIWPlanningEastern@Powerco.co.nz and CIWPlanningWestern@Powerco.co.nz
(Engineer’s will send approval to the DG admin team, who will then send it out to the installer.)
•	The data received by email is able to be edited. The left column is the title and the right is the unique name, which can be changed in the advanced setting of each field when building.
•	For the customer and installer emails, there is an option to insert the answer to a specific field in the email content. Select ‘form fields’ in the tool bar.
**Emails:**

# Conditional Logic:

Conditional Logic is used by JotForm to determine what elements of the form are visible, calculate values of fields, etc. This form makes extensive use of conditional logic, and it can be very easy to break. This document goes into a page by page breakdown of the logic in the form. 
Unfortunately, JotForm does not allow for the logic to be clearly laid out but displays all the separate conditions in a list. It can be a massive timesaver to use the field sort dropdown to sort the conditions by the fields they affect. Be aware that this does not include fields that are affected as part of a Hide/Show Multiple statement, which can mean you have to manually scroll through the conditions.

**By Number/Order in JotForm:**

By Number/Order in JotForm:
Note that these numbers could change if new logic is added, as it defaults to position one.
1.	This condition hides the first page break and uncovers the hidden text if ‘Which option best describes your relationship with Powerco?’ is set to ‘Customer’.

2.	This condition hides the second page break and the “Please refer to the links’ & ‘Please fill out this application’ fields are shown if ‘is the DG system's total nameplate capacity over 10kW in total?’ is set to ‘Yes’. 

ICP Lookup/customer details:

3.	This condition hides the ‘ICP Lookup’ button on the fourth page if the hidden field ‘ICP Backend’ on the fourth page is set to 1. This is done so that in the case that the icp_lookup.js doesn’t run, the text field it overwrites is hidden, so a user could progress through the form normally.

4.	This condition hides the fourth page break if ‘ICP Backend’ is set to 0. The user cannot progress unless they press the ICP lookup button. icp_lookup.js sets ‘ICP backend’ to 0 when it initially runs. Pressing the ICP lookup button changes the value of ‘ICP Backend’, allowing the user to progress or not, depending on the value (see code section at bottom of page for more details). 

5.	This condition hides ‘Is the address below correct?’ and ‘Is the Energy Retailer below correct?’ on the fifth page, if the ‘ICP backend’ value is changed to ‘-2’ or ‘1’. These values mean there was an issue with the lookup, or that icp_lookup.js didn’t run, respectively (See Code Section at bottom of page for more details).

6.	This condition shows the text field ‘Please go back and check…’ if ‘Is the address below correct?’ is set to ‘No’. This is just to get the user to check that they entered the ICP number correctly.

7.	This condition disables the ‘Connection address’ field if both ‘ICP backend’ is changed to 2, and ‘Is the address below correct?’ is set to ‘Yes’. A user must select ‘No’ for ‘Is the address below correct?’ to change the address, which allows us to flag that there is a data discrepancy.

ICP backend field summary:

 ICP Backend Field Value:	Explanation:	                                                                       Allowed to continue:
 -2	                       There was an issue when running the lookup.	                                                   Yes
  0	                       ICP lookup has initially run, but button has not been clicked yet, or ICP is invalid.           No
  1	                       ICP lookup hasn’t run.                                                                          Yes
  2	                       ICP has run and validation successful.	                                                       Yes

System details:

8.	This condition sets ‘Inverter 1 backend’ to 1 when ‘Is the system being installed, removed or upgraded/modified?’ is set to removed, and ‘Please specify if this is a new or existing inverter’ is equal to ‘existing’ (for inverter 1). This is so that any fields shown by the inverter lookup are hidden so the user can select next without having to run the inverter lookup.

9.	This condition hides all the fields under ‘Inverter Model 1’ section of page seven when ‘Is the system being installed, removed or upgraded?’ is set to ‘Removed’. It also shows the fields under the ‘Existing System Details’ section, that is hidden by default.

10.	This condition shows the fields under the ‘Existing System Details’ section of page seven when ‘Is the system being installed, removed or upgraded?’ is set to ‘Upgraded/Modified’.

11.	This condition hides the ‘Please specify if this is a new or existing inverter’ fields on pages seven, eight, nine and ten when ‘Is the system being installed, removed or upgraded?’ is not set to ‘Upgraded/Modified’. This is because these fields are only relevant when the system is being upgraded or modified.

12.	This condition hides page thirteen when ‘is the system being installed, removed, or upgraded/modified?’ is not set to removed.

13.	This condition skips straight from page seven to page thirteen when ‘Is the system being installed, removed or upgraded/modified?’ is set to ‘Removed’. This is because none of the pages between these two are relevant if the system is being removed.

14.	This condition hides the ‘Inverter Manufacturer’ and ‘How many of this specific type of inverter will be in the system?’ fields on page eight, if ‘No. of different inverter models in system’ is less than 2. This is simply so that those fields aren’t included in the autogenerated email, as for some reason when they weren’t hidden, they were included even though they were empty.

15.	This condition is the same as condition 14, only it hides the two fields on page nine if ‘No. of different inverter models in system’ is less than 3.

16.	This condition is the same as condition 14, only it hides the two fields on page ten if ‘No. of different inverter models in system’ is less than 4.

17.	This condition shows the large free text field that collects information about any additional inverter models beyond the first four if ‘No. of different inverter models in system’ is greater than 4.

18.	This condition hides page eight if ‘No. of different inverter models in system’ is greater than 2. 

19.	This condition hides page nine if ‘No. of different inverter models in system’ is greater than 3.

20.	This condition hides page ten if ‘No. of different inverter models in system’ is greater than 2.

21.	This condition hides the fields ‘Inverter Manufacturer’, ‘Inverter Model Number’ and ‘Inverter lookup result will appear here’ on page seven when the ‘Please specify if this is a new or existing inverter’ field, also on page seven, is set to ‘Existing’. This is because this information is not needed for existing inverters. It will also show the text “Please only fill this out for inverters that are being retained...”

22.	This condition is the same as above, but for page eight.

23.	This condition is the same as above, but for page nine.

24.	This condition is the same as above, but for page ten. 

25.	This condition hides the page break on the seventh page if all the following conditions are matched:
    a.	‘Is the system being installed, removed or upgraded/modified?’ is not equal to ‘Removed’
    b.	‘Please specify if this is a new or existing inverter:’ is not equal to ‘Existing’
    c.	‘Inverter 1 backend’ is not equal to 2
    d.	‘Inverter 1 backend’ is not equal to 1
    e.	‘Do you have an AS/NZS 4777.1 & 2 certificate for this inverter?’ is equal to ‘No’
The user is prevented from moving on without doing the inverter lookup. The conditional logic outlined above, excludes all instances where they should be able to continue. 

If the system is being removed, or if this inverter is an existing model, there is no need to do the lookup. If ‘Inverter 1 backend’ is equal to 2 that means the lookup succeeded. If equal to 1, then inverter_lookup.js didn’t run. Finally, a user must be allowed to progress if they can provide an AS/NZS 4777.1 & 2 certificate.

26.	This condition is the same as 24, but for eight.

27.	This condition is the same as 24, but for page nine.
28.	This condition is the same as 24, but for page ten.

29.	This condition calculates the ‘Total maximum export capacity’ field on page 11. It first multiplies the ‘maximum export capacity (kVA) (per inverter)’ by the number of inverters of that same model (‘How many of this specific type of inverter will be part of the system’) from pages seven, eight, nine and ten. Then it adds them all up and inserts the total into the ‘Total maximum…’ field on page 11. It will trigger if at least one of the ‘Maximum export capacity (kVA)’ fields are filled.

30.	This condition shows the ‘Please upload a copy of this certificate’ field on page seven when the ‘Do you have an AS/NZS 4777.1 & 2 certificate for this inverter?’ field on page seven is set to ‘Yes’, so that the user can upload said certificate.

31.	This condition is the same as above, but for page eight

32.	This condition is the same as above, but for page nine

33.	This condition is the same as above, but for page ten

34.	This condition shows the field ‘Do you have an AS/NZS 4777.1 & 2 certificate for this inverter?’ on page seven when ‘Inverter 1 backend’ is equal to ‘-1’. This is done as ‘-1’ means that the lookup has failed, i.e. the inverter is not on the CEC approved list. However, the list isn’t specified in the standard, so we must give them a chance to upload a certificate to show it’s compliant.

35.	This condition is the same as 33, but for page eight. 

36.	This condition is the same as 33, but for page nine. 

37.	This condition is the same as 33, but for page ten. 

38.	This condition hides the ‘Inverter lookup result will appear here’ field on page seven when ‘Inverter 1 backend’ is set to 1. This is done so that if there is an issue and inverter_lookup.js doesn’t run, the text field it overwrites is hidden, so a user could progress through the form normally.

39.	This condition is the same as 37, but for page eight

40.	This condition is the same as 37, but for page nine

41.	This condition is the same as 37, but for page ten

Inverter Backend Field Summary:
Inverter Backend Field Value: 	Explanation: 	                                                                                  Allowed to continue: 
    -1 	                        Lookup was run, and inverter model is invalid. 	                                                            No 
    0 	                        Inverter lookup has initially run, but button has not been clicked yet – button made visible. 	            No 
    1	                        1 is set as the default. If the inverter lookup fails to run when the page is loaded, then it remains as 1.	Yes
    2                           Inverter lookup has run and validation successful OR lookup has timed out.	                                Yes

Inverter Details Summary:
42.	This condition hides all the fields below: 
    a.	‘Total maximum export capacity (kVA)’ on page 11
    b.	‘Loop Impedance (Matrix Field (id402))’
    c.	‘Amps per phase (Matrix Field (id407))’
    d.	‘Measured voltage at Switchboard (V)’ 
    e.	Page break on page 11
and shows the ‘As the total export capacity …’ field, when the ‘Total maximum export capacity (kVA)’ is greater than 10. This is because the form is only design for applications of less than 10kW, and being above 10kVA means that its very probably above 10kW.

43.	This condition shows the version of the ‘Number of phases supplied to the ICP’ field that doesn’t have a single-phase option when ‘Total maximum export capacity (kVA)’ is less than 11 and great than 5. It also shows the text explaining why the user can only choose two or three phases, and a text input should the installer want to justify/query their use of a single phase.

44.	This condition shows the version of the ‘Number of phases supplied to the ICP’ field that has a single-phase option when ‘Total maximum export capacity (kVA)’ is less than 6.
Additional Connection Details Section:

45.	This condition shows the ‘REMINDER: Powerco strongly…’ field if either or both of ‘Volt/Var response mode enabled?’ or ‘Volt/Watt response mode enabled’ are not equal to yes. This is just because we want to make it clear to the user that this mode is strongly recommended.

46.	This condition hides all the fields below the first divider on page twelve, including the page break, if ‘Does the installation comply with Powerco's overvoltage protection requirements detailed in 393S089 Clause 2.2 and 2.3?’  is equal to no. It also shows the ‘Powerco will not accept this…’ text.

47.	This condition shows the field ‘please specify’, if ‘Type(s) of generation’ is equal to ‘other’.

48.	This condition sets ‘Inverter 2 backend’ field to 1 when the ‘Please specify if this is a new or existing inverter’ on page eight is set to existing. This is done to hide the ‘Do you have an AS/NZS 4777.1 & 2 certificate for this inverter?’ question.

49.	This condition sets ‘Inverter 3 backend’ field to 1 when the ‘Please specify if this is a new or existing inverter’ on page nine is set to existing

50.	This condition sets ‘Inverter 4 backend’ field to 1 when the ‘Please specify if this is a new or existing inverter’ on page ten is set to existing

51.	This condition disables the ‘Name of Energy Retailer at DG Site’ field if ICP backend is equal to 2, and ‘Is the Energy Retailer below correct?’ is equal to ‘Yes’. This is done so that we can easily see if the two retailers don’t match.

**By Page:**

First Page:
If the user selects ‘customer’, the page break is hidden so they cannot continue, and paragraph field with relevant information is shown. The user must select ‘installer’ to continue (Condition 1).

Second Page:
If the user selects ‘Yes’, the page break is hidden so they cannot continue, and they are directed to download the current >10KW application form (Condition 2).

Third Page:
No conditional logic.

Fourth Page:
The conditional logic here is all for icp_request.js to use. If icp_request.js does not run, there is effectively no logic for this page. 
If the hidden field titled ‘ICP backend’, is set to 1, as it is by default, the paragraph field ‘ICP button goes here’ will be hidden. This is so that the form is still usable if the script does not run (Condition 3).

When icp_request.js is run, which should happen when the page is loaded if it is properly embedded, ‘ICP backend’ is set to 0, which means the text (‘ICP button goes here’) is made visible. This is then overwritten with the lookup button. If the ICP entered is valid when the button is pressed, or icp_request.js cannot connect to the server, ‘ICP backend’ is set to 2 so the user can continue. If the ICP is invalid, ‘ICP backend’ is set to -1, and the page break is hidden (Condition 4).

Fifth Page:
The conditional logic on this page is a continuation of the logic on the last page. If icp_request.js ran, and was able to connect to the server, the address field is auto filled out. It is disabled unless the user selects ‘no’ for ‘Is the Address below correct?’. This is to flag that the ICP number & address don’t seem to match, and that there may be an issue with our records. If icp_request.js did not run, the ‘is the Address below correct?’ question does not appear, and the address fields are editable (Conditions 5, 6 & 7).

There is a second, hidden address field that is also filled out. This is so that the address fetched from the Electricity Authority can be compared to the one the installer entered, if the two are different.

Sixth Page:
No conditional logic

Seventh Page:
This page is probably one of the most complex in terms of conditional logic. 

Removed System:
If the user selects ‘Removed’, the inverter details (‘Inverter Model 1’) section is hidden, and the ‘Existing System Details’ section is shown. This is because we only need to collect the existing information for a removal (Conditions 8 & 9).

Upgraded/Modified System:
If ‘Upgraded/Modified’ is selected, both the ‘Existing System Details’ & ‘Inverter Details’ sections are shown (Condition 10). For each model of inverter, an extra field is shown, asking if the inverter is a new addition or an existing inverter (Condition 11). If ‘New’ is selected the section functions as normal, but if ‘Existing’ is selected, only the ‘How many of this specific type of inverter will be part of the system?’, ‘Nameplate capacity (kW)’ and ‘Maximum export capacity (kVA)’ fields are shown (Condition 21).

Collecting details of different inverter models:
The ‘Number of DIFFERENT inverter models in system’ question controls how many ‘Inverter Details’ pages are shown. If the user enters 2 models, then there will be two pages shown etc. The form supports up to four models currently, the details of any more having to be entered into a free text field that is appended to the back of the ‘Inverter 4’ page. This works by having four pages in the form, that are skipped if the number in ‘Number of DIFFERENT inverter models in system’ is too low, e.g. the ‘Inverter 4’ page is skipped if it is less than 4 (Conditions 14 – 20). 

Inverter Model Validation:
Finally, the ‘Inverter Model Number’ field works very similarly to the ‘ICP Number’ field. Rather than interacting with icp_request.js, it interacts with inverter_request.js. When inverter _request.js is run, which should happen when the page is loaded if it is properly embedded, ‘Backend text’ is set to 0, which means the text is made visible. This is then overwritten with the lookup button. If the inverter model number is on the approved list, which currently comes from the CEC’s list, or if the request timed out, ‘Backend text’ is set to 2 so the user can progress. 
If it is not approved, ‘Backend text’ is set to 0, which causes the ‘Do you have a AS/NZS 4777.1 & 2 certificate for this inverter?’ field to show. If this is set to ‘Yes’, the user is prompted to upload a copy of the certificate and then can continue. (Conditions 25, 30, 34 & 38).
The logic works by hiding the page break if ‘Backend text’ is not equal to 1 or 2, and the ‘Do you have a AS/NZS 4777.1 & 2 certificate for this inverter?’ is set to ‘No’. In addition, it will not hide the page break if ‘Removed’ is selected.

Eighth Page:
This page has the same lookup logic as the Seventh page and has the same New/Existing logic if ‘Upgraded/Modified’ is selected (Conditions 26, 31, 35 & 39).

Ninth Page:
This page has the same lookup logic as the Seventh page and has the same New/Existing logic if ‘Upgraded/Modified’ is selected (Conditions 27, 32, 36 & 40).

Tenth Page:
This page has the same lookup logic as the Seventh page and has the same New/Existing logic if ‘Upgraded/Modified’ is selected (Conditions 28, 33, 37 & 41).

Eleventh Page:
The ‘Total maximum export capacity (kVA)’ field is calculated from the export capacities already entered for each model, multiplied by the number of inverters of that type (Condition 29). If this field is greater than 10, the user is not able to continue (Condition 42), and the text explaining why they are unable to progress is made visible.

If the ‘Total maximum export capacity (kVA)’ is 5 or less, the version of ‘Number of phases supplied to ICP’ that allows the user to select 1, 2 or 3 phases is shown (Condition 44). If it is greater than 5 and less than 11, then the version of ‘Number of phases supplied to ICP’ that only allows the user to select 2 or 3 phases is shown (Condition 43).

Twelfth page:
If ‘Does the installation comply with Powerco's overvoltage protection requirements detailed in 393S089 Clause 2.2 and 2.3?‘ is set to ‘No’, then all the fields below are hidden, and a message is displayed informing the user that Powerco will not accept this application if it does not comply. 

If this is set to yes, and one or both of ‘Volt/Watt response mode enabled?’ or Volt/VAR response mode enabled?’ are set to ‘No’, a message is displayed reminding the user that Powerco strongly recommends the use of these modes (Conditions 45, 46 & 47).

Thirteenth page:
This page is hidden if ‘Is the system being installed, removed or upgraded/modified?’ is NOT set to removed. If it is set to removed, then page seven skips straight to this page. 

Fourteenth page:
No conditional logic.
