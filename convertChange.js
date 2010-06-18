// -------------------------------------------------------------------------------------
// name......:  convertChange.js
// version...:  0.1.25
// revision..:  2010-169
// -------------------------------------------------------------------------------------
//  Functions for the parsing of SM RFCs
// -------------------------------------------------------------------------------------

importPackage(Packages.org.apache.commons.beanutils);

var IMPACT_FIELD_NAME  = "Impact";

function preFilter(argChange){
// -------------------------------------------------------------------------------------
// Determines whether an incoming RFC ticket should be processed or not.
// @param {RawTicketDynaBean} argChange The RFC ticket from Service Manager
// @return {boolean} true if the RFC ticket should be processed
// -------------------------------------------------------------------------------------
  // Uncomment the following line to see the contents of the change
  // logger.debug(BeanUtils.describe(argChange));
  var smChangeID = argChange.get("header.changeNumber"); 
  logger.info("### converChange preFilter(" + smChangeID + ") Entry ###");
  var creationDate = argChange.get("header.origDateEntered"); 
  var lastUpdated = argChange.get("sysmodtime");  
  var currentPhase = argChange.get("header.currentPhase"); 
  if (smChangeID == null || creationDate == null || lastUpdated == null) {
    logger.warn("Request was missing one or more of the following fields: header.changeNumber, header.origDateEntered, sysmodtime and couldn't be processed. ");
    logger.info("### converChange preFilter(" + smChangeID + ") Exit -> false ###");
    return false;
  }	
  if (currentPhase == "New") {
    logger.info("RFC current phase is \"new\".  Skipping insertion in RC");
    logger.info("### converChange preFilter(" + smChangeID + ") Exit -> false ###");
    return false;
  }
  logger.info("### converChange preFilter(" + smChangeID + ") Exit -> true ###");
  return true;	
}

function postFilter(argGeneric) {
// -------------------------------------------------------------------------------------
// Determines whether a converted RFC ticket should be processed or not.
// @param {GenericTicket} argGeneric The RFC ticket after it was converted by the convert() function
// @return {boolean} true if the generic RFC ticket should be processed
// -------------------------------------------------------------------------------------
  return true;
}

function convert(argChange, argGeneric) {
// -------------------------------------------------------------------------------------
// Converts the RFC retrieved from Service Manager into a GenericTicket 
// that can be used by RC
// @param {RawTicketDynaBean} argChange The RFC ticket from Service Manager
// @param {GenericTicket} argGeneric The result generic ticket, to be used later by RC
// -------------------------------------------------------------------------------------
  var smChangeID = argChange.get("header.changeNumber"); 
  logger.info("### converChange convert(" + smChangeID + ") Entry ###");

  // reqeust-id
  logger.debug("set request-id -> " + smChangeID);
  argGeneric.setField("request-id", smChangeID);
  
  // cnw-request-id
  logger.debug("set cnw-request-id -> " +  smChangeID);
  argGeneric.setField("cnw-request-id", smChangeID);

  // creation-time
  var rcCreationTime = convertDate(argChange.get("header.origDateEntered"));  
  logger.debug("set creation-time -> " + rcCreationTime);
  argGeneric.setField("creation-time", rcCreationTime);
  
  // last-update-time
  var rcLastUpdateTime = convertDate(argChange.get("sysmodtime"));  
  logger.debug("set last-update-time -> " + rcLastUpdateTime);
  argGeneric.setField("last-update-time", rcLastUpdateTime);

  // contact-person
  var rcContactPerson = cwCapitalization(argChange.get("header.changeOwner"));  
  logger.debug("set contact-person -> " + rcContactPerson);
  argGeneric.setField("contact-person", rcContactPerson);
   
  // implementors
  var rcImplementorsNT = argChange.get("header.changeOwnerAccount");
  logger.debug("set implementors -> " + rcImplementorsNT);
  argGeneric.setField("implementors", rcImplementorsNT);

  // cw-implementor
  var rcImplementor = cwCapitalization(argChange.get("header.implementor"));  
  logger.debug("set cw-implementor -> " + rcImplementor);
  argGeneric.setField("cw-implementor", rcImplementor);
  
  // cnw-assigned-to
  var smAssignedTo = cwCapitalization(argChange.get("header.assignedTo")); 
  var rcCnwAssignedTo = (smAssignedTo != null) ? smAssignedTo : ""; 
  logger.debug("set cnw-assigned-to -> " + rcCnwAssignedTo);
  argGeneric.setField("cnw-assigned-to", rcCnwAssignedTo);
  
  // cnw-change-owner-account
  var rcCnwChangeOwnerAccount = argChange.get("header.changeOwnerAccount");  
  logger.debug("set cnw-change-owner-account -> " + rcCnwChangeOwnerAccount);
  argGeneric.setField("cnw-change-owner-account", rcCnwChangeOwnerAccount);

  // cw-implementing-team
  var rcCwImplementingTeam = argChange.get("header.implementingTeam");  
  logger.debug("set cw-implementing-team -> " + rcCwImplementingTeam);
  argGeneric.setField("cw-implementing-team", rcCwImplementingTeam);
 
  // cnw-assigned-to-team
  var rcCnwAssignedToTeam = argChange.get("header.assignedTeam");  
  logger.debug("set cnw-assigned-to-team -> " + rcCnwAssignedToTeam);
  argGeneric.setField("cnw-assigned-to-team", rcCnwAssignedToTeam);
  
  // cw-impacted-locations
  var smAffectedLocations = argChange.get("middle.affectedLocations");  
  var smLocationAll = argChange.get("header.locationAll");  
  if(smLocationAll == "true") {
    rcCwImpactedLocations = "All";
  } else if(smAffectedLocations != null) {
    rcCwImpactedLocations = cwArrayToStringCS(argChange.get("middle.affectedLocations.affectedLocations"));  
  } else {
    rcCwImpactedLocations = "None"
  }
  logger.debug("set cw-impacted-locations -> " + rcCwImpactedLocations);
  argGeneric.setField("cw-impacted-locations", rcCwImpactedLocations);

  // cw-interruption-of-service
  rcCwInterruptionOfService = (argChange.get("middle.outageComments") != null) ? cwArrayToStringEL(argChange.get("middle.outageComments.outageComments")) : null ;
  logger.debug("set cw-interruption-of-service -> " + rcCwInterruptionOfService);
  argGeneric.setField("cw-interruption-of-service", rcCwInterruptionOfService);
  
  // intiated-by
  var rcInitiatedBy = cwCapitalization(argChange.get("header.requestedBy"));  
  logger.debug("set initiated-by -> " + rcInitiatedBy);
  argGeneric.setField("initiated-by", rcInitiatedBy);
  
  // cnw-initiated-by-account
  var rcInitiatedBy = argChange.get("header.requestedByAccount");  
  logger.debug("set cnw-initiated-by-account -> " + rcInitiatedBy);
  argGeneric.setField("cnw-initiated-by-account", rcInitiatedBy);
  
  // opened-by
  var rcOpenedBy = cwCapitalization(argChange.get("header.openedBy"));  
  logger.debug("set opened-by -> " + rcOpenedBy);
  argGeneric.setField("opened-by", rcOpenedBy);

  // category
  var rcCategory = argChange.get("header.category");  
  logger.debug("set category -> " + rcCategory);
  argGeneric.setField("category", rcCategory);
  
  // subcategory
  var rcSubcategory = argChange.get("header.subcategory");  
  logger.debug("set subcategory -> " + rcSubcategory);  
  argGeneric.setField("subcategory", rcSubcategory);
  
  // cw-activity
  var rcCwActivity = argChange.get("header.activity");   // link to next
  logger.debug("set cw-activity -> " + rcCwActivity);
  argGeneric.setField("cw-activity", rcCwActivity);
  
  // new-deployment  
  var rcNewDeploy = (rcCwActivity == "Add New") ? "Yes" : "No"; // link to previous
  logger.debug("set new-deployment -> " + rcNewDeploy);  
  argGeneric.setField("new-deployment", rcNewDeploy);

  // is-tested
  var rcIsTested=(argChange.get("header.passedQA")) ? "Yes" : "No"; 
  logger.debug("set is-tested -> " + rcIsTested);
  argGeneric.setField("is-tested", rcIsTested);
  
  // cw-is-master-change
  var rcCwIsMasterChange=(argChange.get("isMasterChange") == "true") ? "Yes" : "No";  
  logger.debug("set cw-is-master-change -> " + rcCwIsMasterChange);
  argGeneric.setField("cw-is-master-change", rcCwIsMasterChange);

  // priority
  var smPriority = argChange.get("header.priority"); 
  if (smPriority == 1 || smPriority == "High" || smPriority == "High (Urgent)") { 
    var rcPriority = PRIORITY_HIGH;
  } else if (smPriority == 2 || smPriority == "Medium") {
    var rcPriority = PRIORITY_MEDIUM;
  } else if (smPriority == 3 || smPriority == "Low") {
    var rcPriority = PRIORITY_LOW;
  } else {
    var rcPriority = "Unknown";
  }
  logger.debug("set priority -> " + rcPriority);
  argGeneric.setField("priority", rcPriority);

  // status
  var smCurrentPhase = argChange.get("header.currentPhase"); 
  if (smCurrentPhase == "New") {
    var rcStatus = STATUS_NEW;
  } else if (smCurrentPhase == "Open") {
    var rcStatus = STATUS_OPEN;
  } else if (smCurrentPhase == "Pending Approval") {
    var rcStatus = STATUS_PENDING_APPROVAL;
  } else if (smCurrentPhase == "Pending Acceptance") {
    var rcStatus = STATUS_PENDING_ACCEPTANCE;
  } else if (smCurrentPhase == "Scheduled") {
    var rcStatus = STATUS_SCHEDULED;
  } else if (smCurrentPhase == "Declined") {
    var rcStatus = STATUS_DECLINED;
  } else if (smCurrentPhase == "Implemented") {
    var rcStatus = STATUS_IMPLEMENTED;
  } else if (smCurrentPhase == "Review") {
    var rcStatus = STATUS_REVIEW;    
  } else if (smCurrentPhase == "Closed") {
    var rcStatus = STATUS_CLOSED;
  } else {  
    var rcStatus = "Unknown";
  }
  logger.debug("set status -> " + rcStatus);
  argGeneric.setField("status",rcStatus);

  // cw-approval-status
  var smChangeApprovalStatus = argChange.get("header.changeApprovalStatus");  
  if (smChangeApprovalStatus == "approved") {
    var rcApprovalStatus = "Approved";
  } else if (smChangeApprovalStatus == "denied") {
    var rcApprovalStatus = "Denied";
  } else if (smChangeApprovalStatus == "pending") {
    var rcApprovalStatus = "Pending";
  } else {
    var rcApprovalStatus = "Unknown";
  }
  logger.debug("set cw-approval-status -> " + rcApprovalStatus);
  argGeneric.setField("cw-approval-status", rcApprovalStatus);

  // user-estimated-risk
  var smRiskAssessment = argChange.get("header.riskAssessment");  
  if (smRiskAssessment == 1) {
    var rcUserEstimatedRisk = ESTIMATEDRISK_VERY_HIGH;
  } else if (smRiskAssessment == 2) {
    var rcUserEstimatedRisk = ESTIMATEDRISK_HIGH;
  } else if (smRiskAssessment == 3) {
    var rcUserEstimatedRisk = ESTIMATEDRISK_MEDIUM_HIGH;
  } else if (smRiskAssessment == 4) {
    var rcUserEstimatedRisk = ESTIMATEDRISK_MEDIUM;
  } else if (smRiskAssessment == 6) {
    var rcUserEstimatedRisk = ESTIMATEDRISK_LOW;
  } else if (smRiskAssessment == 9) {
    var rcUserEstimatedRisk = ESTIMATEDRISK_VERY_LOW;
  } else {
    var rcUserEstimatedRisk = "Unknown";
  }
  logger.debug("set user-estimated-risk -> " + rcUserEstimatedRisk);
  argGeneric.setField("user-estimated-risk", rcUserEstimatedRisk);

  // planned-end-time 
  logger.debug("set planned-end-time -> " + argChange.get("header.plannedEndDate"));
  setDateField(argChange.get("header.plannedEndDate")  , "planned-end-time"  , argGeneric); 

  // planned-start-time 
  logger.debug("set planned-start-time -> " + argChange.get("header.plannedStartDate"));
  setDateField(argChange.get("header.plannedStartDate"), "planned-start-time", argGeneric); 

  // cnw-planned-days
  var rcCnwPlannedDays = argChange.get("header.plannedDays");
  logger.debug("set cnw-planned-days -> " + rcCnwPlannedDays);
  argGeneric.setField("cnw-planned-days",rcCnwPlannedDays); 

  // cnw-planned-overdue
  var rcCnwPlannedOverdue=(argChange.get("header.plannedOverdue")) ? "Yes" : "No"; 
  logger.debug("set cnw-planned-overdude -> " + rcCnwPlannedOverdue);
  argGeneric.setField("cnw-planned-overdue",rcCnwPlannedOverdue); 

  // scheduled-downtime-end
  logger.debug("set scheduled-downtime-end -> " + argChange.get("middle.outageEnd"));
  setDateField(argChange.get("middle.outageEnd"), "scheduled-downtime-end"  , argGeneric); 

  // scheduled-downtime-start
  var smOutageStart = argChange.get("middle.outageStart");  // needed in is-outage planned below
  logger.debug("set scheduled-downtime-start -> " + smOutageStart);
  setDateField(smOutageStart, "scheduled-downtime-start", argGeneric);  

  // is-outage-planned
  var rcIsOutagePlanned = ((smOutageStart != null) && (smOutageStart != "null")) ? "Yes" : "No";  // gotten from scheduled-downtime-start above
  logger.debug("set is-outage-planned -> " + rcIsOutagePlanned);
  argGeneric.setField("is-outage-planned", rcIsOutagePlanned);

  // actual-end-time
  setDateField(argChange.get("header.actualEnd"), "actual-end-time"  , argGeneric);  
  logger.debug("set actual-end-time -> " + argChange.get("header.actualStart"));

  // actual-start-time
  setDateField(argChange.get("header.actualStart"), "actual-start-time", argGeneric);  
  logger.debug("set actual-start-time -> " + argChange.get("header.actualStart"));

  // description
  var rcDescription = (argChange.get("descriptionStructure.description") != null) ? cwArrayToStringEL(argChange.get("descriptionStructure.description.description")) : null ;  
  logger.debug("set description -> " + rcDescription);
  argGeneric.setField("description", rcDescription);

  // summary
  var smBriefDescription = argChange.get("header.briefDescription");  
  logger.debug("set summary -> " + smBriefDescription);
  argGeneric.setField("summary", smBriefDescription);

  // cnw-justifcation
  var rcJustification = (argChange.get("descriptionStructure.justification") != null) ? cwArrayToStringEL(argChange.get("descriptionStructure.justification.justification")) : null;  
  logger.debug("set cnw-justifcation -> " + rcJustification);
  argGeneric.setField("cnw-justifcation", rcJustification);

  // review-time
  logger.debug("set review-time -> " + argChange.get("header.closeTime"));
  setDateField(argChange.get("header.closeTime"), "review-time", argGeneric);  

  // review-outcome
  var smCompletionCode = argChange.get("header.completionCode");  
  var rcReviewOutcome = "N/A";      
  if (rcStatus == STATUS_CLOSED) { // defined above in status 
    if (smCompletionCode == 1) {
      var rcReviewOutcome = OUTCOME_SUCCESSFUL_NO_PROBLEMS;
    } else if (smCompletionCode == 2) {
      var rcReviewOutcome = OUTCOME_SUCCESSFUL_WITH_PROBLEMS;
    } else if (smCompletionCode == 3) {
      var rcReviewOutcome = OUTCOME_FAILED;
    } else if (smCompletionCode == 4) {
      var rcReviewOutcome = OUTCOME_REJECTED; 
    } else if (smCompletionCode == 5) {
      var rcReviewOutcome = OUTCOME_CANCELLED;
    } 
  }
  logger.debug("set review-outcome -> " + rcReviewOutcome);
  argGeneric.setField("review-outcome", rcReviewOutcome);

  // review-comments
  var rcReviewComments = (argChange.get("closureComments") != null) ? cwArrayToStringEL(argChange.get("closureComments.closureComments")) : null ;  
  logger.debug("set review-comments -> " + rcReviewComments);
  argGeneric.setField("review-comments", rcReviewComments);

  // is-backout-possible
  var rcIsBackoutPossible = (argChange.get("header.noBackout") == "true") ? "No" : "Yes" ;  
  logger.debug("set is-backout-possible -> " + rcIsBackoutPossible);
  argGeneric.setField("is-backout-possible", rcIsBackoutPossible);

  // changed-ci-list
  var rcChangedCiList = argChange.get("middle.configurationItem");  
  if (argChange.get("middle.assets") != null) { 
    rcChangedCiList = cwArrayToStringCS(argChange.get("middle.assets.assets")); 
  }
  logger.debug("set changed-ci-list -> " + rcChangedCiList);
  argGeneric.setField("changed-ci-list", rcChangedCiList);  

  // approved-groups
  var rcApprovedGroups = (argChange.get("approvalStructure.approvedGroups") != null) ? cwArrayToStringSep(argChange.get("approvalStructure.approvedGroups.approvedGroups"), ",") : null;  
  logger.debug("set approved-groups -> " + rcApprovedGroups);
  argGeneric.setField("approved-groups", rcApprovedGroups);

  // current-pending-groups
  var rcCurrentPendingGroups = (argChange.get("approvalStructure.currentPendingGroups") != null) ? cwArrayToStringSep(argChange.get("approvalStructure.currentPendingGroups.currentPendingGroups"), ",") : null;  
  logger.debug("set current-pending-groups -> " + rcCurrentPendingGroups);
  argGeneric.setField("current-pending-groups",   rcCurrentPendingGroups);

  // cnw-pending-approval-groups
  logger.debug("set cnw-pending-approval-groups -> " + rcCurrentPendingGroups);  // from current-pending-groups
  argGeneric.setField("cnw-pending-approval-groups", rcCurrentPendingGroups);  

  // approvals-required
  var rcApprovalsRequired = (argChange.get("approvalStructure.approvalsRequired") != null) ? cwArrayToStringSep(argChange.get("approvalStructure.approvalsRequired.approvalsRequired"), ",") : null;  
  logger.debug("set approvals-required -> " + rcApprovalsRequired);
  argGeneric.setField("approvals-required", rcApprovalsRequired);
  
  // cnw-implementor-account
  var rcCnwImplementorAccount = argChange.get("header.implementorAccount");  
  logger.debug("set cnw-implementor-account -> " + rcCnwImplementorAccount);
  argGeneric.setField("cnw-implementor-account", rcCnwImplementorAccount);  
  
  // cnw-originator-account
  var rcCnwOriginatorAccount = argChange.get("header.originatorAccount");  
  logger.debug("set cnw-originator-account -> " + rcCnwOriginatorAccount);
  argGeneric.setField("cnw-originator-account", rcCnwOriginatorAccount);  
  
  // cnw-assigned-to-account
  var rcCnwAssignedToAccount = argChange.get("header.assignedToAccount");  
  logger.debug("set cnw-assigned-to-account -> " + rcCnwAssignedToAccount);
  argGeneric.setField("cnw-assigned-to-account", rcCnwAssignedToAccount);  

  // cnw-team-lead-account
  var smCnwTeamLeadAccount = argChange.get("header.teamLeadAccount");  
  logger.debug("set cnw-team-lead-account -> " + smCnwTeamLeadAccount);
  argGeneric.setField("cnw-team-lead-account", smCnwTeamLeadAccount);
  
  // cnw-cab-level
  var rcCnwCabLevel = argChange.get("header.cabType");  
  logger.debug("set cnw-cab-level -> " + rcCnwCabLevel);
  argGeneric.setField("cnw-cab-level", rcCnwCabLevel);
  
  // cnw-change-manager
  var rcCnwChangeManager = argChange.get("header.coordinator"); 
  logger.debug("set cnw-change-manager -> " + rcCnwChangeManager);
  argGeneric.setField("cnw-change-manager", cwCapitalization(rcCnwChangeManager));
  
  // cnw-owning-team
  var rcCnwOwningTeam = argChange.get("header.owningTeam");  
  logger.debug("set cnw-owning-team -> " + rcCnwOwningTeam);
  argGeneric.setField("cnw-owning-team", rcCnwOwningTeam);
  
  // cnw-implementation-plan
  var rcPlan = (argChange.get("descriptionStructure.plan") != null) ? cwArrayToStringEL(argChange.get("descriptionStructure.plan.plan")) : null;  
  logger.debug("set cnw-implementation-plan -> " + rcPlan);
  argGeneric.setField("cnw-implementation-plan", rcPlan);

  // cnw-backout-plan
  var rcCnwBackoutPlan = (argChange.get("descriptionStructure.backoutMethod") != null) ? cwArrayToStringEL(argChange.get("descriptionStructure.backoutMethod.backoutMethod")) : null;  
  logger.debug("set cnw-backout-plan -> " + rcCnwBackoutPlan);
  argGeneric.setField("cnw-backout-plan", rcCnwBackoutPlan);
  
  // is-sox-app-involved
  var rcIsSoxAppInvolved = (argChange.get("header.sox") == "true") ? "Yes" : "No";  
  logger.debug("set is-sox-app-involved -> " + rcIsSoxAppInvolved);
  argGeneric.setField("is-sox-app-involved", rcIsSoxAppInvolved);
  
  // cnw-review-required
  var rcCnwReviewRequired = (argChange.get("header.review") == "true" || argChange.get("header.review") == "1") ? "Yes" : "No" ;  
  logger.debug("set cnw-review-required -> " + rcCnwReviewRequired);
  argGeneric.setField("cnw-review-required", rcCnwReviewRequired);
  
  // cnw-user-risk
  var smRisk = argChange.get("header.risk");  
  if (smRisk == "1") {
     rcCnwUserRisk = "High";
 } else if (smRisk == "2") {
    rcCnwUserRisk = "Medium";
  } else if (smRisk == "3") {
    rcCnwUserRisk = "Low";
  } else {
    rcCnwUserRisk = null;
  }
  logger.debug("set cnw-user-risk -> " + rcCnwUserRisk);
  argGeneric.setField("cnw-user-risk", rcCnwUserRisk);

  // cnw-user-impact
  var smInitialAssessment = argChange.get("initialAssessment"); 
  if (smInitialAssessment == "1") {
    rcCnwUserImpact = "High";
  } else if (smInitialAssessment == "2") {
    rcCnwUserImpact = "Medium";
  } else if (smInitialAssessment == "3") {
    rcCnwUserImpact = "Low";
  } else {
    rcCnwUserImpact = null;
  }
  argGeneric.setField("cnw-user-impact", rcCnwUserImpact);
  logger.debug("set cnw-user-impact -> " + rcCnwUserImpact);

  logger.info("### converChange convert(" + smChangeID + ") Exit ###");
} eof : convert


function cwArrayToStringCS(argObject){
// -------------------------------------------------------------------------------------
// Parses an array of webservice's types into array of strings Comma Seperated
// -------------------------------------------------------------------------------------
  var returnStr = "";
  if (argObject != null){
    for (i = 0 ; i < argObject.length-1 ; i++) {
      returnStr += argObject[i] + ", ";
    }
    returnStr += argObject[i];
  }
  return returnStr;
}


function cwArrayToStringEL(argObject){
// -------------------------------------------------------------------------------------
// Parses an array of webservice's types into array of strings adding an EndLine to each
// -------------------------------------------------------------------------------------
  var returnStr = "";
  if (argObject != null){
    for(i = 0 ; i < argObject.length-1 ; i++){
      returnStr += argObject[i] + "\n";
    }
    returnStr += argObject[i];
  }
  return returnStr;
}


function cwArrayToStringSep(argObject, argSeperator){
// -------------------------------------------------------------------------------------
// Parses an array of webservice's types into array of strings seperating with arg seperator
// -------------------------------------------------------------------------------------
  var returnStr = "";
  if (argObject != null){
    for( i = 0 ; i < argObject.length-1 ; i++){
      returnStr += argObject[i] + argSeperator;
    }
    returnStr += argObject[i];
  }
  return returnStr;
}


function setDateField(argFieldName, argGenericFieldName, argGeneric) {
// -------------------------------------------------------------------------------------
// Sets the ticket's argGenericFieldName field with the correct date 
// -------------------------------------------------------------------------------------
  if (argFieldName != null) {
    argGeneric.setField(argGenericFieldName, convertDate(argFieldName));    
  }
}


function convertDate(argDate) {
// -------------------------------------------------------------------------------------
// SM WS dates are given in UTC. We need to convert it from string to long.
// -------------------------------------------------------------------------------------
  if (argDate == null){
    return 0;
  } else {
     var dateFormat = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
     // If SC/SM doesn't return the times in UTC, you need to configure the timezone here.
     dateFormat.setTimeZone(java.util.TimeZone.getTimeZone("UTC"));
     var parsedDate = dateFormat.parse(argDate);
     var dateInMillis = parsedDate.getTime();
     return dateInMillis;   
  }
}


function cwCapitalization (argString) {
// -------------------------------------------------------------------------------------
// Sets the string to initial capitalization
// -------------------------------------------------------------------------------------
  if (argString == null || argString.length == 0) {
    return argString;
  }
  var myCap = true;
  var myString = new java.lang.String(argString);
  var myData = myString.toCharArray();
  for (i = 0 ; i < myData.length ; i++) {
    if (myData[i] == ' ' || java.lang.Character.isWhitespace(myData[i])) {
      myCap = true;
    } else if (myCap) {
      myData[i] = java.lang.Character.toUpperCase (myData[i]);
      myCap = false;
    } else {
      myData[i] = java.lang.Character.toLowerCase (myData[i]);
    }
  }
  return java.lang.String.copyValueOf(myData);
}
