// -------------------------------------------------------------------------------------
// name......:  change-flow.js
// version...:  0.1.14
// revision..:  2010-134
// -------------------------------------------------------------------------------------
//  Functions for RFC Notification 
// -------------------------------------------------------------------------------------

importPackage(Packages.org.apache.commons.beanutils);
importPackage(Packages.java.util);

//-----------------------------------------------------------------------------
// Variable Assignment Begin
//-----------------------------------------------------------------------------
var VERSION                      = "0.1.14 -> 2010-134";
var USE_CASE_1_HEADER            = "Notification Event Use Case 1 - Assignment Change <br> ";
var ASSIGN_CHANGE_HEADER         = "<br><b>Event: </b> RFC <b><u>Assignment Change</u></b> has occurred.<br><br>";
var ASSIGN_CHANGE_FOOTER         = "<br><br><b>Action: </b> Please take note that this assignment change has taken place and <b><u>you may have a task to complete.</u></b>";
var RFC_APP_DEV_HEADER           = "<br><b>Event: </b> Voting is complete, and this RFC has been ";
var RFC_APP_DEV_FOOTER           = "<br><br><b>Action: </b> As the Change Owner, please take note of the voting result.";
var RFC_PEND_APP_TO_SCHED_HEADER = "<br><b>Event: </b> The RFC has been <b><u>Approved</u></b> and is now <b><u>Scheduled</u></b> for implementation.";
var RFC_PEND_APP_TO_SCHED_FOOTER = "<br><br><b>Action: </b> As the <b><u>Change Owner</u></b>, please take note that your change has been <b><u>Approved</u></b>.  As the <b><u>Change Implementor</u></b>, please take note of the <b><u>Planned Start Date</u></b> and plan accordingly.";
var RFC_NEW_TO_SCHED_HEADER      = "<br><b>Event: </b> The Standard RFC has been <b><u>Scheduled</u></b> for implementation.";
var RFC_NEW_TO_SCHED_FOOTER      = "<br><br><b>Action: </b>As the <b><u>Change Implementor</u></b>, please take note of the <b><u>Planned Start Date</u></b> and plan accordingly.";
var RFC_NEW_TO_OPEN_HEADER       = "<br><b>Event: </b> A new RFC has transitioned from <b><u>New</u></b> to <b><u>Open.</u></b>";
var RFC_NEW_TO_OPEN_FOOTER       = "<br><br><b>Action: </b> As the Change Team Lead identified for this RFC, please <b><u>assess the change and prepare it for review.</u></b>";
var RFC_SCHED_TO_IMP_HEADER      = "<br><b>Event: </b> The RFC phase has changed from <b><u>Scheduled</u></b> to <b><u>Implemented.</u></b>";
var RFC_SCHED_TO_IMP_FOOTER      = "<br><br><b>Action: </b> As the Change Owner, please validate the RFC has been implemented as expected and then <b><u>Close</u></b> it.";
var RFC_IMP_TO_CLOSE_HEADER      = "<br><b>Event: </b> The RFC phase has changed from <b><u>Implemented</u></b> to <b><u>Closed.</u></b>";
var RFC_IMP_TO_CLOSE_FOOTER      = "<br><br><b>Action: </b> As the Change Owner, please take note that this RFC has been <b><u>Closed</u></b>";
var RFC_SCHED_TO_CLOSE_HEADER    = "<br><b>Event: </b> The RFC phase has changed from <b><u>Scheduled</u></b> to <b><u>Closed.</u></b>";
var RFC_SCHED_TO_CLOSE_FOOTER    = "<br><br><b>Action: </b> As the Change Owner, please take note that this RFC has been <b><u>Closed</u></b>";
var RFC_PAST_IMP_DATE_HEADER     = "<br><b>Event: </b> The RFC is 3 days beyonds its <b><u>Planned End Date</u></b> and is not yet closed.";
var RFC_PAST_IMP_DATE_FOOTER     = "<br><br><b>Action: </b> As the Change Owner, please <b><u>Close</u></b> the RFC or update the Planned End Date.";
var RFC_CHANGE_TYPE_HEADER       = "<br><b>Event: </b> The RFC type has changed from";
var RFC_CHANGE_TYPE_FOOTER       = "<br><br><b>Action: </b> As the Change Owner, please take note that this change has occurred, as it may impact on your planning.";
var RFC_CHANGE_APP_REQ_HEADER    = "<br><b>Event: </b> The RFC <b><u>requires approval</u></b> from your team.";
var RFC_CHANGE_APP_REQ_FOOTER    = "<br><br><b>Action: </b> As a designated Change Approver for your team, please <b><u>review the RFC for approval</u></b>.";
var RFC_CHANGE_CANCELLED_HEADER  = "<br><b>Event: </b> The RFC has been <b><u>cancelled</u></b>.";
var RFC_CHANGE_CANCELLED_FOOTER  = "<br><br><b>Action: </b> As the Change Owner and / or Implementor, please take note that this RFC has been <b><u>cancelled</u></b>.";
//--------------------------
// Variable Assignment End
//--------------------------

function preChangeProcess(prevChange, newChange) {
//-----------------------------------------------------------------------------
// Does Nothing
//-----------------------------------------------------------------------------
}

function postChangeProcess(prevChange, newChange) {
//-----------------------------------------------------------------------------
// Does Nothing
//-----------------------------------------------------------------------------
}

function shouldAnalyze(prevChange, newChange) {
//-----------------------------------------------------------------------------
// 
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog + " *** shouldAnalyze Entry ***");
  var result = false;
  if (newChange.isInitialLoadState()) {
    result = true;
  }
  if (newChange.isTicketAnalyzer()) {
    result = true;
  }
  if (!result) {
    result = !(newChange.isAnalysisRulesEqual(prevChange));
  }
  logger.info(sLog + " *** shouldAnalyze Exit " + result + " ***");
  return result;
}

function shouldCalcImpact(prevChange, newChange) {
//-----------------------------------------------------------------------------
//
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog + " *** shouldCalcImpact Entry ***");
  if (newChange.isInitialLoadState()) {
    logger.info(sLog + " - change is initial load state");
    logger.info(sLog + " *** shouldCalcImpact Exit true ***");
    return true;
  }
  var newChangeValidStatus = isStatusValid4Calc(newChange);
  var prevChangeValidStatus = isStatusValid4Calc(prevChange);
  if (prevChange == null) {
    logger.info(sLog + " *** shouldCalcImpact Exit true ***");
    return true;
  }
  if (!prevChangeValidStatus && newChangeValidStatus) {
    logger.info(sLog + " *** shouldCalcImpact Exit true ***");
    return true;
  } else if (!newChange.isAnalyzedCisEquals(prevChange)) { // check if the analyzed ci's NOT equals
    logger.info(sLog + " *** shouldCalcImpact Exit " + newChangeValidStatus + " ***");
    return newChangeValidStatus;
  }
  logger.info(sLog + " *** shouldCalcImpact Exit " + newChangeValidStatus + " ***");
  return newChangeValidStatus;
}

function preCalcRisk(prevChange, newChange) {
//-----------------------------------------------------------------------------
// This script is called after shouldCalcRisk return true and before risk 
// calculation / re-calculation,
// Does Nothing
//-----------------------------------------------------------------------------
}

function shouldCalcRisk(prevChange, newChange) {
//-----------------------------------------------------------------------------
// Note - this script is also called in risk recalculation
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog + " *** shouldCalcRisk Entry ***");
  var shouldCalc = isStatusValid4Calc(newChange);
  logger.info(sLog + " *** shouldCalcRisk Exit " + shouldCalc + " ***");
  return shouldCalc;
}

function overrideRisk(prevChange, newChange, analysis, result) {
//--------------------------------------------------------------
// Script that allows overriding the standard risk calculation.
// The reasons for overriding the risk should be returned using 
// the result.addRule("") API.
// Does Nothing
//--------------------------------------------------------------
}

function shouldCalcCollision(prevChange, newChange) {
//----------------------------------------------------------------------------
// Script that allows to define for which changes the collisions will be 
// calculated. Should be used as a fuse, only in order to prevent performance 
// problems with problematic changes. Like a change that spans over 2 months 
// and will collide with thousands of changes.
// Returns true for every call
//----------------------------------------------------------------------------
  return true;
}

function addActionItemsOnChange(prevChange, newChange, actionItemsContext) {
//--------------------------------------------------------------------------
// Returns false for every call
//--------------------------------------------------------------------------
  return false;
}

function getUsersToNotify(prevChange, newChange, notificationContext) {
//-----------------------------------------------------------------------------
// used for notification email processing * This controls it all *
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog + " *** getUsersToNotify Entry ***");
  logger.info(sLog + " - version " + VERSION);
  result = false;
  if (!result) {result = notifyCancelled                  (prevChange,newChange,notificationContext);}
  if (!result) {result = notifyPlannedStartEnd            (prevChange,newChange,notificationContext);}
  if (!result) {result = notifyApprovalRequested          (prevChange,newChange,notificationContext);}
  if (!result) {result = notifyNewToOpen                  (prevChange,newChange,notificationContext);}
  if (!result) {result = notifyNewToScheduled             (prevChange,newChange,notificationContext);}
  if (!result) {result = notifyPendingApprovalToScheduled (prevChange,newChange,notificationContext);}
  if (!result) {result = notifyScheduledToClosed          (prevChange,newChange,notificationContext);}
  if (!result) {result = notifyScheduledToImplemented     (prevChange,newChange,notificationContext);}
  if (!result) {result = notifyImplementedToClosed        (prevChange,newChange,notificationContext);}
  if (!result) {result = notifyTypeChanged                (prevChange,newChange,notificationContext);}
  if (!result) {result = notifyAssignmentChanged          (prevChange,newChange,notificationContext);}
  logger.info(sLog + " *** getUsersToNotify Exit ***");
}

function notifyCancelled(prevChange, newChange, notificationContext) {
//-----------------------------------------------------------------------------
// Notification for Change Is Cancelled
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog+" ### notifyCancelled Entry ###");
  if (prevChange != null) {
    message = "";
    if (newChange.getField("review-outcome") == OUTCOME_WITHDRAWN || newChange.getField("review-outcome") == OUTCOME_CANCELLED) {
      message = RFC_CHANGE_CANCELLED_HEADER + RFC_CHANGE_CANCELLED_FOOTER;
      logger.info(" - adding cnw-change-owner-account to notification -> " + newChange.getField("cnw-change-owner-account"));
      logger.info(" - adding cnw-implementor-account to notification -> " + newChange.getField("cnw-implementor-account") );
      notificationContext.addUser(newChange.getField("cnw-change-owner-account"));
      notificationContext.addUser(newChange.getField("cnw-implementor-account"));
      notificationContext.setMessage(message);
      logger.info(sLog+" ### notifyCancelled Exit true ###");
      return true;
    }
  }
  logger.info(sLog+" ### notifyCancelled Exit false ###");
  return false;
}

function notifyPlannedStartEnd(prevChange, newChange, notificationContext) {
//-----------------------------------------------------------------------------
// Notification for Change Planned Start/End Date-Time Changed
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog + " ### notifyPlannedDate Entry ###");
  sNewStatus = newChange.getField("status") ; sOldStatus = (prevChange!=null) ? prevChange.getField("status") : "";
  if (prevChange!=null && sNewStatus.equals(sOldStatus)) {
    oPSNew = newChange.getField("planned-start-time") ; oPSOld = prevChange.getField("planned-start-time");
    oPENew = newChange.getField("planned-end-time")   ; oPEOld = prevChange.getField("planned-end-time");
    if (!oPSNew.equals(oPSOld) || !oPENew.equals(oPEOld)) {
      bAdd = false;
      if (sNewStatus==STATUS_OPEN || sNewStatus==STATUS_PENDING_APPROVAL || sNewStatus==STATUS_PENDING_ACCEPTANCE || sNewStatus==STATUS_SCHEDULED) {
        aField = ["cnw-originator-account","cnw-initiated-by-account","cnw-change-owner-account"];
        for( i=0 ; i<aField.length ; i++ ) {
          sData = newChange.getField(aField[i]) ; logger.info(" - adding "+aField[i]+" to notification -> " + sData) ; notificationContext.addUser(sData);
        }
        bAdd = true;
      }
      if (sNewStatus==STATUS_PENDING_APPROVAL || sNewStatus==STATUS_PENDING_ACCEPTANCE) {
        sField = "cnw-change-owner-account"; 
        sData = newChange.getField(sField) ; logger.info(" - adding "+sField+" to notification -> " + sData) ; notificationContext.addUser(sData);
      }
      if (sNewStatus==STATUS_SCHEDULED) {
        aField = ["cnw-implementor-account","cw-implementing-team"];
        for( i=0 ; i<aField.length ; i++ ) {
          sData = newChange.getField(aField[i]);
          if (sData!=null) {
            logger.info(" - adding "+aField[i]+" to notification -> " + sData) ; notificationContext.addUser(sData);
          }
        }
      }
      if (bAdd) {
        sMsg =  "<br>";
  			sMsg += "<table class=\"textfont\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">";
        sMsg += " <tbody>";
        sMsg += "  <tr><th class=\"hl\" align=\"left\">RFC Event</th></tr>";
        sMsg += "  <tr><th class=\"space\" align=\"left\"></th></tr>";
        sMsg += "	</tbody>";
        sMsg += "</table>";
        sMsg += "<table class=\"textfont\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">";
        sMsg += " <tbody>";
        sMsg += "  <tr><td class=\"descr\">The <b><u>Planned Start/End</b></u> of the RFC has <b>changed</b>!</td></tr>";
        sMsg += "  <tr><td></td></tr>";
        sMsg += "	</tbody>";
        sMsg += "</table>";
        sMsg += "<br>";
        sMsg += "<table>";
        if(!oPSNew.equals(oPSOld)) {
          sMsg += "<tr><td class=\"chl\" width=\"25%\">New Planned Start:</td>      <td class=\"ctext\">"+DOut(oPSNew)+"</td></tr>";
          sCorP = "Previous";
        } else {
          sCorP = "Current";
        }
        sMsg += "<tr><td class=\"chl\" width=\"25%\">"+sCorP+" Planned Start:</td> <td class=\"ctext\">"+DOut(oPSOld)+"</td></tr>";
        sMsg += "<tr><td>&nbsp;</td></tr>";
        if(!oPENew.equals(oPEOld)) {
          sMsg += "<tr><td class=\"chl\" width=\"25%\">New Planned End:</td>        <td class=\"ctext\">"+DOut(oPENew)+"</td></tr>";
          sCorP = "Previous";
        } else {
          sCorP = "Current";
        }
        sMsg += "<tr><td class=\"chl\" width=\"25%\">"+sCorP+" Planned End:</td>   <td class=\"ctext\">"+DOut(oPEOld)+"</td></tr>";
        sMsg += "</table>";
        sMsg += "<br>";
  			sMsg += "<table class=\"textfont\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">";
        sMsg += " <tbody>";
        sMsg += "  <tr><th class=\"hl\" align=\"left\">RFC Action Needed</th></tr>";
        sMsg += "  <tr><th class=\"space\" align=\"left\"></th></tr>";
        sMsg += "	</tbody>";
        sMsg += "</table>";
        sMsg += "<table class=\"textfont\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">";
        sMsg += " <tbody>";
        sMsg += "  <tr><td class=\"descr\">As a person or team associated to this RFC, please take note of the change in date and <b><u>plan accordingly</u></b>.</td></tr>";
        sMsg += "  <tr><td></td></tr>";
        sMsg += "	</tbody>";
        sMsg += "</table>";
        notificationContext.setMessage(sMsg);
        logger.info(sLog + " ### notifyPlannedDate Exit true ###");
        return true;
      }
    }
  } else {
    logger.info(" - Start/End has changed but phase has changed also which has precedence -> exiting");
  }
  logger.info(sLog + " ### notifyPlannedDate Exit false ###");
  return false;
}

function notifyApprovalRequested(prevChange, newChange, notificationContext) {
//-----------------------------------------------------------------------------
// Notification for cnw-pending-approval-groups
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog+" ### notifyApprovalRequested Entry ###");
  if (newChange.getField("category").equalsIgnoreCase("Normal") || newChange.getField("category").equalsIgnoreCase("Emergency") || newChange.getField("category").equalsIgnoreCase("Standard")) {
    if (prevChange == null || prevChange.getField("status") != STATUS_PENDING_APPROVAL) {
      if (newChange.getField("status") == STATUS_PENDING_APPROVAL) {
        message = RFC_CHANGE_APP_REQ_HEADER + RFC_CHANGE_APP_REQ_FOOTER;
        pendingGroups = newChange.getField("cnw-pending-approval-groups");
        pendingGroupsArray = pendingGroups.split(",");
        var bAddUser = false;
        for (x = 0; x < pendingGroupsArray.length; x++) {
          var group = pendingGroupsArray[x].trim();
          if (group != null && !"".equals(group)){
            bAddUser = true;
            logger.info(" - adding group to notification -> " + group);
            notificationContext.addUser(group);
          }
        }
        if (newChange.getField("cnw-cab-level").equalsIgnoreCase("Enterprise")) {
          bAddUser = true;
          sECabDL = "CA - IT ITSM Enterprise CAB";
          logger.info(" - adding ECAB DL to notification -> " + sECabDL);
          notificationContext.addUser(sECabDL);
        }
        if (bAddUser) {
          notificationContext.setMessage(message);
          logger.info(sLog+" ### notifyApprovalRequested Exit true ###");
          return true;
        } else {
          logger.info(" # ERROR # No group/users to add -> Cancelling approval requested notification!");
        }
      }
    }
  }
  logger.info(sLog+" ### notifyApprovalRequested Exit false ###");
  return false;
}

function notifyNewToOpen(prevChange, newChange,  notificationContext) {
//-----------------------------------------------------------------------------
// Notification for New To Open
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog + " ### notifyNewToOpen Entry ###");
  if (newChange.getField("category").equalsIgnoreCase("Normal") || newChange.getField("category").equalsIgnoreCase("Emergency")) {
    if (prevChange == null && newChange.getField("status") == STATUS_OPEN) {
      logger.info(" - category -> Normal or Emergency AND prev status -> null AND new status -> Open");
      message = RFC_NEW_TO_OPEN_HEADER + RFC_NEW_TO_OPEN_FOOTER;
      if (newChange.getField("cnw-team-lead-account") != null) {
        logger.info(" - adding cnw-team-lead-account to notification -> " + newChange.getField("cnw-team-lead-account"));
        notificationContext.addUser(newChange.getField("cnw-team-lead-account"));
        notificationContext.setMessage(message);
        logger.info(" ### notifyNewToOpen Exit true ###");
        return true;
      } else {
        logger.info(" # ERROR # cnw-team-lead-account is null -> Cancelling new to open notification!");
      }
    }
  }
  logger.info(sLog + " ### notifyNewToOpen Exit false ###");
  return false;
}

function notifyNewToScheduled(prevChange,newChange,notificationContext) {
//-----------------------------------------------------------------------------
// Notification for standard changes moving from New to Scheduled
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog+" ### notifyNewToScheduled Entry ###");
  if (newChange.getField("category").equalsIgnoreCase("Standard") && newChange.getField("status") == STATUS_SCHEDULED) {
    if (prevChange != null) {
      sPrevVal  = " - prev status  -> " + prevChange.getField("status");
      bPrevNull = false;
    } else {
      sPrevVal  = " - prev status  -> null (this means it was NEW)";
      bPrevNull = true;
    }
    if (bPrevNull || newChange.getField("status") != prevChange.getField("status")) {

      logger.info(" - new category -> " + newChange.getField("category"));
      logger.info(" - new status   -> " + newChange.getField("status"));
      logger.info(sPrevVal);

      logger.info(" - new cnw-implementor-account -> " + newChange.getField("cnw-implementor-account"));
      logger.info(" - new cw-implementing-team    -> " + newChange.getField("cw-implementing-team"));
      if (newChange.getField("cnw-implementor-account") != null && !"".equalsIgnoreCase(newChange.getField("cnw-implementor-account"))) {
        message = RFC_NEW_TO_SCHED_HEADER + "<br><br>";
        message = message + " <b>Change Owner: </b>" + newChange.getField("contact-person") + "<br><br>";
        message = message + " <b>Change Implementor: </b>" + newChange.getField("cw-implementor");
        message = message + RFC_NEW_TO_SCHED_FOOTER;
        logger.info(" - new cnw-implementor-account is not null");
        logger.info(" - adding cnw-implementor-account to notification -> " + newChange.getField("cnw-implementor-account"));
        notificationContext.addUser(newChange.getField("cnw-implementor-account"));          
        logger.info(" - adding cnw-change-owner-account to notification -> " + newChange.getField("cnw-change-owner-account"));
        notificationContext.addUser(newChange.getField("cnw-change-owner-account"));
        notificationContext.setMessage(message);
        logger.info(sLog+" ### notifyNewToScheduled Exit true ###");
        return true;
      } else {
        if (newChange.getField("cw-implementing-team") != null && !"".equalsIgnoreCase(newChange.getField("cw-implementing-team"))) {
          message = RFC_NEW_TO_SCHED_HEADER + "<br><br>";
          message = message + " <b>Change Implementor Team: </b>" + newChange.getField("cw-implementing-team");
          message = message + RFC_NEW_TO_SCHED_FOOTER;
          logger.info(" - new cnw-implementor-account is null and cw-implementing-team is not null");
          logger.info(" - adding cw-implementing-team to notification -> " + newChange.getField("cw-implementing-team"));
          notificationContext.addUser(newChange.getField("cw-implementing-team"));
          logger.info(" - adding cnw-change-owner-account to notification -> " + newChange.getField("cnw-change-owner-account"));
          notificationContext.addUser(newChange.getField("cnw-change-owner-account"));
          notificationContext.setMessage(message);
          logger.info(sLog+" ### notifyNewToScheduled Exit true ###");
          return true;
        }
        logger.info(" # ERROR # cnw-implementor-account and cw-implementing-team are null -> Cancelling new to scheduled notification!");
      }
    }
  }
  logger.info(sLog+" ### notifyNewToScheduled Exit false ###");
  return false;
}

function notifyPendingApprovalToScheduled(prevChange, newChange, notificationContext) {
//-----------------------------------------------------------------------------
// Notification for changes moving from pending approval to scheduled
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog + " ### notifyPendingApprovalToScheduled Entry ###");
  if (newChange.getField("category").equalsIgnoreCase("Normal") || newChange.getField("category").equalsIgnoreCase("Emergency")) {
    if (prevChange != null) {
      if (prevChange.getField("status") == STATUS_PENDING_APPROVAL & newChange.getField("status") == STATUS_SCHEDULED) {
        if (newChange.getField("cnw-implementor-account") != null && !"".equalsIgnoreCase(newChange.getField("cnw-implementor-account"))) {
          message = RFC_PEND_APP_TO_SCHED_HEADER + "<br><br>";
          message = message + " <b>Change Owner: </b>" + newChange.getField("contact-person") + "<br><br>";
          message = message + " <b>Change Implementor: </b>" + newChange.getField("cw-implementor");
          message = message + RFC_PEND_APP_TO_SCHED_FOOTER;
          logger.info(" - adding cnw-implementor-account to notification -> " + newChange.getField("cnw-implementor-account"));
          notificationContext.addUser(newChange.getField("cnw-implementor-account"));          
          logger.info(" - adding cnw-change-owner-account to notification -> " + newChange.getField("cnw-change-owner-account"));
          notificationContext.addUser(newChange.getField("cnw-change-owner-account"));
          notificationContext.setMessage(message);
          logger.info(sLog + " ### notifyPendingApprovalToScheduled Exit true ###");
          return true;
        } else {
          if (newChange.getField("cw-implementing-team") != null && !"".equalsIgnoreCase(newChange.getField("cw-implementing-team"))) {
            message = RFC_PEND_APP_TO_SCHED_HEADER + "<br><br>";
            message = message + " <b>Change Owner: </b>" + newChange.getField("contact-person") + "<br><br>";
            message = message + " <b>Change Implementor: </b>" + newChange.getField("cw-implementing-team");
            message = message + RFC_PEND_APP_TO_SCHED_FOOTER;
            logger.info(" - adding cw-implementing-team to notification -> " + newChange.getField("cw-implementing-team"));
            notificationContext.addUser(newChange.getField("cw-implementing-team"));
            logger.info(" - adding cnw-change-owner-account to notification -> " + newChange.getField("cnw-change-owner-account"));
            notificationContext.addUser(newChange.getField("cnw-change-owner-account"));
            notificationContext.setMessage(message);
            logger.info(sLog + " ### notifyPendingApprovalToScheduled Exit true ###");
            return true;
          }
        }
        
      }
    }
  }
  logger.info(sLog + " ### notifyPendingApprovalToScheduled Exit false ###");
  return false;
}

function notifyScheduledToClosed(prevChange,newChange,notificationContext) {
//-----------------------------------------------------------------------------
// Notification for standard changes moving from Scheduled to Closed
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog + " ### notifyScheduledToClosed Entry ###");
  if (newChange.getField("category").equalsIgnoreCase("Standard") && newChange.getField("status") == STATUS_CLOSED ) {
    logger.info(" - new category -> " + newChange.getField("category"));
    logger.info(" - new status   -> " + newChange.getField("status"));
    if (prevChange != null) {
      logger.info(" - prev status  -> " + prevChange.getField("status"));
      bPrevNull=false;
    } else {
      logger.info(" - prev status  -> null (this means it was NEW and user manually moved it to closed)");
      bPrevNull=true;
    }
    if (bPrevNull || newChange.getField("status") != prevChange.getField("status")) {
      logger.info(" - new cnw-change-owner-account -> " + newChange.getField("cnw-change-owner-account"));
      if (newChange.getField("cnw-change-owner-account") != null && !"".equalsIgnoreCase(newChange.getField("cnw-change-owner-account"))) {
        message = RFC_SCHED_TO_CLOSE_HEADER + "<br><br>";
        message = message + " <b>Change Owner: </b>" + newChange.getField("contact-person");
        message = message + RFC_SCHED_TO_CLOSE_FOOTER;
        logger.info(" - adding cnw-change-owner-account to notification -> " + newChange.getField("cnw-change-owner-account"));
        notificationContext.addUser(newChange.getField("cnw-change-owner-account"));
        notificationContext.setMessage(message);
        logger.info(sLog + " ### notifyScheduledToClosed Exit true ###");
        return true;
      }
      logger.info(" # ERROR # cnw-change-owner-account is null -> Cancelling scheduled to closed notification!");
    }
  }
  logger.info(sLog + " ### notifyScheduledToClosed Exit false ###");
  return false;
}

function notifyScheduledToImplemented(prevChange, newChange,notificationContext) {
//-----------------------------------------------------------------------------
// Notification for Scheduled To Implemented
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog + " ### notifyScheduledToImplemented Entry ###");
  if (newChange.getField("category").equalsIgnoreCase("Normal") || newChange.getField("category").equalsIgnoreCase("Emergency") || newChange.getField("category").equalsIgnoreCase("Standard")) {
    if (prevChange != null) {
      message = "";
      messageHeader = "Notification Event Use Case 4 - Status Change \n ";
      if (prevChange.getField("status") == STATUS_SCHEDULED && newChange.getField("status") == STATUS_IMPLEMENTED) {
        message = RFC_SCHED_TO_IMP_HEADER + RFC_SCHED_TO_IMP_FOOTER;
        logger.info(" - adding cnw-change-owner-account to notification -> " + newChange.getField("cnw-change-owner-account"));
        notificationContext.addUser(newChange.getField("cnw-change-owner-account"));
        notificationContext.setMessage(message);
        logger.info(sLog + " ### notifyScheduledToImplemented Exit true ###");
        return true;
      }
    }
  }
  logger.info(sLog + " ### notifyScheduledToImplemented Exit false ###");
  return false;
}

function notifyImplementedToClosed(prevChange, newChange,notificationContext) {
//-----------------------------------------------------------------------------
// Notification for Implemented To Closed
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog + " ### notifyImplementedToClosed Entry ###");
  if (newChange.getField("category").equalsIgnoreCase("Normal") || newChange.getField("category").equalsIgnoreCase("Emergency") || newChange.getField("category").equalsIgnoreCase("Standard")) {
    if (prevChange != null) {
      message = "";
      messageHeader = "Notification Event Use Case 5 - Status Change \n ";
      if ((prevChange.getField("status") == STATUS_IMPLEMENTED || prevChange.getField("status") == STATUS_SCHEDULED) && newChange.getField("status") == STATUS_CLOSED) {
        message = RFC_IMP_TO_CLOSE_HEADER + RFC_IMP_TO_CLOSE_FOOTER;
        id = newChange.getField("request-id");
        logger.info(" - adding cnw-change-owner-account to notification -> " + newChange.getField("cnw-change-owner-account"));
        notificationContext.addUser(newChange.getField("cnw-change-owner-account"));
        notificationContext.setMessage(message);
        logger.info(sLog + " ### notifyImplementedToClosed Exit true ###");
        return true;
      }
    }
  }
  logger.info(sLog + " ### notifyImplementedToClosed Exit false ###");
  return false;
}

function notifyTypeChanged(prevChange, newChange, notificationContext) {
//-----------------------------------------------------------------------------
// Notification for RFC Type Changes
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog + " ### notifyTypeChanged Entry ###");
  if (newChange.getField("category").equalsIgnoreCase("Normal") || newChange.getField("category").equalsIgnoreCase("Emergency") || newChange.getField("category").equalsIgnoreCase("Standard")) {
    if (prevChange != null) {
      if (!prevChange.getField("category").equals(newChange.getField("category"))) {
        logger.info(" - category changed -> from " + prevChange.getField("category") + " to " + newChange.getField("category"));
        message = RFC_CHANGE_TYPE_HEADER + " <u><b>" + prevChange.getField("category") + " to " + newChange.getField("category") + "</u></b>." + RFC_CHANGE_TYPE_FOOTER;
        logger.info(" - adding cnw-change-owner-account to notification -> " + newChange.getField("cnw-change-owner-account"));
        notificationContext.addUser(newChange.getField("cnw-change-owner-account"));
        notificationContext.setMessage(message);
        logger.info(sLog + " ### notifyTypeChanged Exit true ###");
        return true;
      }
    }
  }
  logger.info(sLog + " ### notifyTypeChanged Exit false ###");
  return false;
}

function notifyAssignmentChanged(prevChange, newChange, notificationContext) {
//-----------------------------------------------------------------------------
// Notification for Assignment Changes
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog + " ### notifyAssignmentChanged Entry ###");
  if (prevChange != null && (prevChange.getField("cnw-assigned-to") == null || prevChange.getField("cnw-assigned-to") == "") && (newChange.getField("cnw-assigned-to") != null && newChange.getField("cnw-assigned-to") != "" )) {
    message = ASSIGN_CHANGE_HEADER + "&nbsp;&nbsp;Current Assignee: "  + newChange.getField("cnw-assigned-to") + ASSIGN_CHANGE_FOOTER;
    logger.info(" - adding cnw-assigned-to-account to notification -> " + newChange.getField("cnw-assigned-to-account"));
    notificationContext.addUser(newChange.getField("cnw-assigned-to-account"));
    notificationContext.setMessage(message);
    logger.info(sLog + " ### notifyAssignmentChanged Exit true ###");
    return true;
  }
  if (prevChange != null) {
    prevuser = prevChange.getField("cnw-assigned-to");
    newuser = newChange.getField("cnw-assigned-to");
    if (!prevuser.equalsIgnoreCase(newuser)) {
      message = ASSIGN_CHANGE_HEADER + "&nbsp;&nbsp;Current Assignee: " + newuser + "<br>&nbsp;&nbsp;Previous Assignee: " + prevuser + ASSIGN_CHANGE_FOOTER;
      logger.info(" - adding new cnw-assigned-to-account to notification -> " + prevChange.getField("cnw-assigned-to-account"));
      logger.info(" - adding old cnw-assigned-to-account to notification -> " + newChange.getField("cnw-assigned-to-account"));
      notificationContext.addUser(prevChange.getField("cnw-assigned-to-account"));
      notificationContext.addUser(newChange.getField("cnw-assigned-to-account"));
      notificationContext.setMessage(message);
      logger.info(sLog + " ### notifyAssignmentChanged Exit true ###");
      return true;
    }
  }
  logger.info(sLog + " ### notifyAssignmentChanged Exit false ###");
  return false;
}

function shouldCalcTimePeriods(prevChange, newChange) {
//-----------------------------------------------------------------------------
// Check for Should Calc Time Periods
// Always Returns true
//-----------------------------------------------------------------------------
  return true;
}

function shouldCalcSimilar(prevChange, newChange) {
//-----------------------------------------------------------------------------
// Check for Should Calc Similar
// Always Returns true
//-----------------------------------------------------------------------------
  return true;
}

// ============================================================================
// =                                                                          =
// = Utility Functions                                                        =
// =                                                                          =
// ============================================================================

function isLongerThan(change, duration) {
//-----------------------------------------------------------------------------
// Compares varible against a time
//-----------------------------------------------------------------------------
  plannedStartTime = change.getField("planned-start-time");
  plannedEndTime = change.getField("planned-end-time");
  changeDuration = plannedEndTime - plannedStartTime;
  if (changeDuration > duration) {
    return true;
  }
  return false;
}

function isStatusValid4Calc(change) {
//-----------------------------------------------------------------------------
// Validates Status for Calc
//-----------------------------------------------------------------------------
  if (change == null) {
    return false;
  }
  var status = change.getField("status");
  return status == STATUS_PENDING_APPROVAL || status == STATUS_CLOSED 
      || status == STATUS_OPEN || status == STATUS_SCHEDULED
      || status == STATUS_IMPLEMENTED
      || status == STATUS_PENDING_ACCEPTANCE;
}

function LTrim(value) {
//-----------------------------------------------------------------------------
// Removes leading whitespaces
//-----------------------------------------------------------------------------
  var re = /\s*((\S+\s*)*)/;
  return value.replaceAll(re, "$1");
}

function RTrim(value) {
//-----------------------------------------------------------------------------
// Removes ending whitespaces
//-----------------------------------------------------------------------------
  var re = /((\s*\S+)*)\s*/;
  return value.replaceAll(re, "$1");
}

function localTrim(value) {
//-----------------------------------------------------------------------------
// Removes leading and ending whitespaces
//-----------------------------------------------------------------------------
  return LTrim(RTrim(value));
}


function DOut(oDate) {
//-----------------------------------------------------------------------------
// Formats Date Object to a readable string
//-----------------------------------------------------------------------------
  Date.prototype.getDayName   = function() {return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][this.getDay()];}
  Date.prototype.getMonthName = function() {return ['January','February','March','April','May','June','July','August','September','October','November','December'][this.getMonth()];}
  dDate = new Date(parseInt(oDate)); 
  nTZH = dDate.getTimezoneOffset() / 60 ;
  sTZN = (nTZH == 8) ? "PST" : "PDT";
  dDate.setHours(dDate.getHours() + nTZH); 
  sAorP = (dDate.getHours()<12) ? "AM" : "PM";
  sHours   = dDate.getHours()   ; sHours   = (sHours   < 10) ? "0"+sHours   : sHours;
  sMinutes = dDate.getMinutes() ; sMinutes = (sMinutes < 10) ? "0"+sMinutes : sMinutes;
  sSeconds = dDate.getSeconds() ; sSeconds = (sSeconds < 10) ? "0"+sSeconds : sSeconds;
  sReturn =  dDate.getDayName()+", ";
  sReturn += dDate.getMonthName()+" "+dDate.getDate()+", "+dDate.getFullYear()+", ";
  sReturn += sHours+":"+sMinutes+":"+sSeconds+" "+sAorP+" ("+sTZN+")";
  bLogIt = false;
  if(bLogIt) {
    logger.info(" - nTZH    -> " + nTZH); 
    logger.info(" - sTZN    -> " + sTZN); 
    logger.info(" - sAorP   -> " + sAorP); 
    logger.info(" - oDate   -> " + oDate); 
    logger.info(" - dDate   -> " + dDate);
    logger.info(" - sReturn -> " + sReturn);
  }
  return sReturn;
}
