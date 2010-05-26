// -------------------------------------------------------------------------------------
   name      =  "change-flow.js" ;
   version   =  "0.1.20a1"       ;
   revision  =  "2010-142"       ;
// -------------------------------------------------------------------------------------
//  Functions for RFC Notification 
// -------------------------------------------------------------------------------------

importPackage(Packages.org.apache.commons.beanutils);
importPackage(Packages.java.util);

//-----------------------------------------------------------------------------
// Variable Assignment Begin
//-----------------------------------------------------------------------------
var USE_CASE_1_HEADER            = "Notification Event Use Case 1 - Assignment Change <br> ";
var ASSIGN_CHANGE_HEADER         = "<br><b>Event: </b> RFC <b><u>Assignment Change</u></b> has occurred.<br><br>";
var ASSIGN_CHANGE_FOOTER         = "<br><br><b>Action: </b> Please take note that this assignment change has taken place and <b><u>you may have a task to complete.</u></b>";
var RFC_APP_DEV_HEADER           = "<br><b>Event: </b> Voting is complete, and this RFC has been ";
var RFC_APP_DEV_FOOTER           = "<br><br><b>Action: </b> As the Change Owner, please take note of the voting result.";
var RFC_PEND_APP_TO_SCHED_HEADER = "<br><b>Event: </b> The RFC has been <b><u>Approved</u></b> and is now <b><u>Scheduled</u></b> for implementation.";
var RFC_PEND_APP_TO_SCHED_FOOTER = "<br><br><b>Action: </b> As the <b><u>Change Owner</u></b>, please take note that your change has been <b><u>Approved</u></b>.  As the <b><u>Change Implementor</u></b>, please take note of the <b><u>Planned Start Date</u></b> and plan accordingly.";
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
//--------------------------
// Variable Assignment End
//--------------------------

function preChangeProcess(prevChange,newChange) {
//-----------------------------------------------------------------------------
// Does Nothing
//-----------------------------------------------------------------------------
}

function postChangeProcess(prevChange,newChange) {
//-----------------------------------------------------------------------------
// Does Nothing
//-----------------------------------------------------------------------------
}

function shouldAnalyze(prevChange,newChange) {
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

function shouldCalcImpact(prevChange,newChange) {
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

function preCalcRisk(prevChange,newChange) {
//-----------------------------------------------------------------------------
// This script is called after shouldCalcRisk return true and before risk 
// calculation / re-calculation,
// Does Nothing
//-----------------------------------------------------------------------------
}

function shouldCalcRisk(prevChange,newChange) {
//-----------------------------------------------------------------------------
// Note - this script is also called in risk recalculation
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog + " *** shouldCalcRisk Entry ***");
  var shouldCalc = isStatusValid4Calc(newChange);
  logger.info(sLog + " *** shouldCalcRisk Exit " + shouldCalc + " ***");
  return shouldCalc;
}

function overrideRisk(prevChange,newChange,analysis,result) {
//--------------------------------------------------------------
// Script that allows overriding the standard risk calculation.
// The reasons for overriding the risk should be returned using 
// the result.addRule("") API.
// Does Nothing
//--------------------------------------------------------------
}

function shouldCalcCollision(prevChange,newChange) {
//----------------------------------------------------------------------------
// Script that allows to define for which changes the collisions will be 
// calculated. Should be used as a fuse, only in order to prevent performance 
// problems with problematic changes. Like a change that spans over 2 months 
// and will collide with thousands of changes.
// Returns true for every call
//----------------------------------------------------------------------------
  return true;
}

function addActionItemsOnChange(prevChange,newChange,actionItemsContext) {
//--------------------------------------------------------------------------
// Returns false for every call
//--------------------------------------------------------------------------
  return false;
}

function getUsersToNotify(prevChange,newChange,notificationContext) {
//-----------------------------------------------------------------------------
// used for notification email processing * This controls it all *
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog+" *** getUsersToNotify Entry ***");
  logger.info(sLog+" - "+name+" version "+version+" revision "+revision);
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

function notifyCancelled(prevChange,newChange,notificationContext) {
//-----------------------------------------------------------------------------
// Notification for Change Is Cancelled
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog+" ### notifyCancelled Entry ###");
  if (prevChange != null) {
    if (newChange.getField("review-outcome") == OUTCOME_WITHDRAWN || newChange.getField("review-outcome") == OUTCOME_CANCELLED) {
      bAdded = false;
      aField = ["cnw-originator-account","cnw-initiated-by-account","cnw-change-owner-account","cnw-implementor-account"];
      for( i=0 ; i<aField.length ; i++ ) {
        sData = AllTrim(newChange.getField(aField[i]));
        if (!(sData.equals(null) || sData.equals(""))) {
          logger.info(" - adding "+aField[i]+" to notification -> " + sData) ; notificationContext.addUser(sData);
          bAdded = true;
        } else {
          logger.info(" # ERROR # "+aField[i]+" is null");
        }
      }
      if (bAdded) {
        sEvtText = "The RFC has been <b><u>cancelled</u>!";
        sActText = "As the Submitter, Originator, Change Owner, and/or Implementor, please take note that this RFC has been <b><u>cancelled</u></b>.";
        notificationContext.setMessage(MsgCompile(sEvtText,sActText));
        logger.info(sLog+" ### notifyCancelled Exit true ###");
        return true;
      } else {
        logger.info(" - Cancelled change but no users to notify! -> exiting");
        logger.info(sLog+" ### notifyCancelled Exit false ###");
        return true;
      }
    }
  }
  logger.info(sLog+" ### notifyCancelled Exit false ###");
  return false;
}

function notifyPlannedStartEnd(prevChange,newChange,notificationContext) {
//-----------------------------------------------------------------------------
// Notification for Change Planned Start/End Date-Time Changed
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog + " ### notifyPlannedDate Entry ###");
  sNewStatus = newChange.getField("status")             ; sOldStatus = (prevChange!=null) ? prevChange.getField("status")             : "";
  oPSNew     = newChange.getField("planned-start-time") ; oPSOld     = (prevChange!=null) ? prevChange.getField("planned-start-time") : "";
  oPENew     = newChange.getField("planned-end-time")   ; oPEOld     = (prevChange!=null) ? prevChange.getField("planned-end-time")   : "";
  if (prevChange!=null && sNewStatus.equals(sOldStatus)) {
    if (!oPSNew.equals(oPSOld) || !oPENew.equals(oPEOld)) {
      bAdded = false;
      if (sNewStatus==STATUS_OPEN || sNewStatus==STATUS_PENDING_APPROVAL || sNewStatus==STATUS_PENDING_ACCEPTANCE || sNewStatus==STATUS_SCHEDULED) {
        aField = ["cnw-originator-account","cnw-initiated-by-account","cnw-change-owner-account"];
        for( i=0 ; i<aField.length ; i++ ) {
          sData = newChange.getField(aField[i]) ; logger.info(" - adding "+aField[i]+" to notification -> " + sData) ; notificationContext.addUser(sData);
        }
        bAdded = true;
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
      if (bAdded) {
        sEvtText = "The <b><u>Planned Start/End</b></u> of the RFC has <b>changed</b>!";
        sActText = "As a person or team associated to this RFC, please take note of the change in date and <b><u>plan accordingly</u></b>.";
        sActFont = "red";
        sEvtTable = "<table>";
        if(!oPSNew.equals(oPSOld)) {
          sEvtTable += "<tr><td class=\"chl\" width=\"25%\">New Planned Start:</td><td class=\"ctext\">"+DOut(oPSNew)+"</td></tr>";
          sCorP = "Previous";
        } else {
          sCorP = "Current";
        }
        sEvtTable += "<tr><td class=\"chl\" width=\"25%\">"+sCorP+" Planned Start:</td> <td class=\"ctext\">"+DOut(oPSOld)+"</td></tr>";
        sEvtTable += "<tr><td>&nbsp;</td></tr>";
        if(!oPENew.equals(oPEOld)) {
          sEvtTable += "<tr><td class=\"chl\" width=\"25%\">New Planned End:</td><td class=\"ctext\">"+DOut(oPENew)+"</td></tr>";
          sCorP = "Previous";
        } else {
          sCorP = "Current";
        }
        sEvtTable += "<tr><td class=\"chl\" width=\"25%\">"+sCorP+" Planned End:</td><td class=\"ctext\">"+DOut(oPEOld)+"</td></tr>";
        sEvtTable += "</table>";
        sEvtTable += "<br>";
        notificationContext.setMessage(MsgCompile(sEvtText,sActText,sActFont,sEvtTable));
        logger.info(sLog + " ### notifyPlannedDate Exit true ###");
        return true;
      }
    }
  } 
  if (prevChange!=null && !sNewStatus.equals(sOldStatus)) {
     if (!oPSNew.equals(oPSOld) || !oPENew.equals(oPEOld)) {
       logger.info(" - Planned Start/End and Phase has changed. Phase has precedence! -> exiting");
     }
  }
  logger.info(sLog + " ### notifyPlannedDate Exit false ###");
  return false;
}

function notifyApprovalRequested(prevChange,newChange,notificationContext) {
//-----------------------------------------------------------------------------
// Notification for cnw-pending-approval-groups
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog+" ### notifyApprovalRequested Entry ###");
  sNewPhase = newChange.getField("category") ; sNewStatus = newChange.getField("status") ; sOldStatus = (prevChange==null) ? "" : prevChange.getField("status"); 
  if (sNewPhase.equals("Normal") || sNewPhase.equals("Emergency") || sNewPhase.equals("Standard")) {
    if (prevChange==null || sOldStatus!=STATUS_PENDING_APPROVAL) {
      if (sNewStatus==STATUS_PENDING_APPROVAL) {
        bAdded = false;
        aAGrps = newChange.getField("cnw-pending-approval-groups").split(",");
        for ( i=0 ; i<aAGrps.length ; i++ ) {
          if (!(aAGrps[i].equals(null) || aAGrps[i].equals(""))){
            logger.info(" - adding Approval Group to notification -> " + aAGrps[i]);
            notificationContext.addUser(aAGrps[i]);
            bAdded = true;
          }
        }
        if (newChange.getField("cnw-cab-level").equals("Enterprise")) {
          sECabDL = "CA - IT ITSM Enterprise CAB";
          logger.info(" - adding ECAB Approval Group to notification -> " + sECabDL);
          notificationContext.addUser(sECabDL);
          bAdded = true;
        }
        if (bAdded) {
          sEvtText = "The RFC <b><u>requires approval</u></b> from your team!";
          sActText = "As a designated Change Approver for your team, please <b><u>review the RFC for approval</u></b>.";
          sActFont = "red";
          notificationContext.setMessage(MsgCompile(sEvtText,sActText,sActFont));
          logger.info(sLog+" ### notifyApprovalRequested Exit true ###");
          return true;
        } else {
          logger.info(" # ERROR # No Approval Groups to add! -> exiting");
        }
      }
    }
  }
  logger.info(sLog+" ### notifyApprovalRequested Exit false ###");
  return false;
}

function notifyNewToOpen(prevChange,newChange,notificationContext) {
//-----------------------------------------------------------------------------
// Notification for New To Open
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog + " ### notifyNewToOpen Entry ###");
  sEvtText = "A new RFC has transitioned from <b><u>New</u></b> to <b><u>Open.</u>" ; sActFont = "red";
  sNewPhase = newChange.getField("category") ; sNewStatus = newChange.getField("status") ; sOldStatus = (prevChange==null) ? "" : prevChange.getField("status"); 
  if (sNewPhase.equals("Normal") || sNewPhase.equals("Emergency")) {
    if (prevChange==null && sNewStatus==STATUS_OPEN && sNewStatus!=sOldStatus) {
      bNoCTL = false;
      aField = ["cnw-team-lead-account","cnw-originator-account","cnw-initiated-by-account"];
      for( i=0 ; i<aField.length ; i++ ) {
        sData = AllTrim(newChange.getField(aField[i]));
        if (!(sData.equals(null) || sData.equals(""))) {
          logger.info(" - adding "+aField[i]+" to notification -> " + sData) ; notificationContext.addUser(sData);
        } else {
          logger.info(" # ERROR # "+aField[i]+" is null");
          if (i==0) {bNoCTL = true;}
        }
      }
      if (bNoCTL) {
        sActText = "There was NO <b>Change Team Lead</b> identified for this RFC.  One needs to be identified to assess the RFC and prepare it for review.";
      } else {
        sActText = "The <b>Change Team Lead</b> ("+newChange.getField("cnw-change-manager")+") identified for this RFC needs to <b><u>taka gander at da RFC an pare'it fur raview</u>.";
        //sActText = "The <b>Change Team Lead</b> ("+newChange.getField("cnw-change-manager")+") identified for this RFC needs to <b><u>assess the RFC and prepare it for review</u>.";
      }
      notificationContext.setMessage(MsgCompile(sEvtText,sActText,sActFont));
      logger.info(" ### notifyNewToOpen Exit true ###");
      return true;
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
  sNewPhase = newChange.getField("category") ; sNewStatus = newChange.getField("status") ; sOldStatus = (prevChange==null) ? "" : prevChange.getField("status"); 
  if (sNewPhase.equals("Standard") && sNewStatus == STATUS_SCHEDULED) {
    if (prevChange!=null || sNewStatus!=sOldStatus) {
      bAdded = false;
      aField = ["cnw-originator-account","cnw-initiated-by-account","cnw-change-owner-account"];
      for( i=0 ; i<aField.length ; i++ ) {
        sData = newChange.getField(aField[i]) ; logger.info(" - adding "+aField[i]+" to notification -> " + sData) ; notificationContext.addUser(sData);
      }
      sIAField = "cnw-implementor-account" ; sIAData = newChange.getField(sIAField) ; sIAName = newChange.getField("cw-implementor");
      sITField = "cw-implementing-team"    ; sITData = newChange.getField(sITField) ;
      if ( !(sIAData.equals(null) && sIAData.equals("")) ) {
        logger.info(" - adding "+sIAField+" to notification -> " + sIAData) ; notificationContext.addUser(sIAData);
        bAdded = true; 
        sTitle = "Change Implementor";
        sTFill = sIAName;
      } else if ( !(sITData.equals(null) && sITData.equals("")) ) {
        logger.info(" - adding "+sITField+" to notification -> " + sITData) ; notificationContext.addUser(sITData);
        bAdded = true; 
        sTitle = "Change Implementing Team";
        sTFill = sITData;
      }
      sEvtText  =  "The Standard RFC has been <b><u>Scheduled</u></b> for implementation!";
      sActText  =  "As the <b><u>"+sTitle+"</u></b> ("+sTFill+"), please take note of the <b><u>Planned Start Date</u></b> and plan accordingly.";
      sActFont  =  "red";
      if (bAdded) {
        notificationContext.setMessage( MsgCompile(sEvtText,sActText,sActFont) );
        logger.info(sLog+" ### notifyNewToScheduled Exit true ###");
        return true;
      } else {
         logger.info(" # ERROR # cnw-implementor-account and cw-implementing-team are null -> Cancelling new to scheduled notification!");
      }
    }
  }
  logger.info(sLog+" ### notifyNewToScheduled Exit false ###");
  return false;
}

function notifyPendingApprovalToScheduled(prevChange,newChange,notificationContext) {
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

function notifyScheduledToImplemented(prevChange,newChange,notificationContext) {
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

function notifyImplementedToClosed(prevChange,newChange,notificationContext) {
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

function notifyTypeChanged(prevChange,newChange,notificationContext) {
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

function notifyAssignmentChanged(prevChange,newChange,notificationContext) {
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

function shouldCalcTimePeriods(prevChange,newChange) {
//-----------------------------------------------------------------------------
// Check for Should Calc Time Periods
// Always Returns true
//-----------------------------------------------------------------------------
  return true;
}

function shouldCalcSimilar(prevChange,newChange) {
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

function AllTrim(value) {
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
  nTZH  = dDate.getTimezoneOffset() / 60 ;
  sTZN  = (nTZH == 8) ? "PST" : "PDT";
  dDate.setHours(dDate.getHours() + nTZH); 
  sAorP    = (dDate.getHours()<12) ? "AM" : "PM";
  sHours   = dDate.getHours()   ; sHours   = (sHours   < 10) ? "0"+sHours   : sHours;
  sMinutes = dDate.getMinutes() ; sMinutes = (sMinutes < 10) ? "0"+sMinutes : sMinutes;
  sSeconds = dDate.getSeconds() ; sSeconds = (sSeconds < 10) ? "0"+sSeconds : sSeconds;
  sReturn  = dDate.getDayName()+", ";
  sReturn += dDate.getMonthName()+" "+dDate.getDate()+", "+dDate.getFullYear()+", ";
  sReturn += sHours+":"+sMinutes+":"+sSeconds+" "+sAorP+" ("+sTZN+")";
  bLogIt = false;if(bLogIt) {logger.info(" - nTZH    -> "+nTZH);logger.info(" - sTZN    -> "+sTZN);logger.info(" - sAorP   -> "+sAorP);logger.info(" - oDate   -> "+oDate);logger.info(" - dDate   -> "+dDate);logger.info(" - sReturn -> "+sReturn);}
  return sReturn;
}

function MsgCompile(saEvtText,saActText,saActFont,saEvtTable) {
//-----------------------------------------------------------------------------
// Formats Date Object to a readable string
//-----------------------------------------------------------------------------
  if(saActFont==null) {saActFont="";}
  if(saEvtTable==null) {saEvtTable="";}

  srMsg =  "<br>";
  srMsg += "<table class=\"textfont\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">";
  srMsg += " <tbody>";
  srMsg += "  <tr><th class=\"hl\" align=\"left\">RFC Event</th></tr>";
  srMsg += "  <tr><th class=\"space\" align=\"left\"></th></tr>";
  srMsg += "	</tbody>";
  srMsg += "</table>";
  srMsg += "<table class=\"textfont\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">";
  srMsg += "  <tr><td class=\"descr\">"+saEvtText+"</td></tr>";
  srMsg += "</table>";
  srMsg += "<br>";
  if (!saEvtTable.equals("")) {
    srMsg += saEvtTable;
  }
  srMsg += "<table class=\"textfont\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">";
  srMsg += " <tbody>";
  if (saActFont.equals("")) {
    srMsg += "  <tr><th class=\"hl\" align=\"left\">RFC Action Needed</th></tr>";
  } else {
    srMsg += "  <tr><th class=\"hl\" align=\"left\"><font color=\""+saActFont+"\">RFC Action Needed</font></th></tr>";
  }
  srMsg += "  <tr><th class=\"space\" align=\"left\"></th></tr>";
  srMsg += "	</tbody>";
  srMsg += "</table>";
  srMsg += "<table class=\"textfont\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">";
  srMsg += "  <tr><td class=\"descr\">"+saActText+"</td></tr>";
  srMsg += "</table>";
  return srMsg;
}