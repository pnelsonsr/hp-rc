// -------------------------------------------------------------------------------------
   name      =  "change-flow.js" ;
   version   =  "0.1.21a1"       ;
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
var RFC_APP_DEV_HEADER           = "<br><b>Event: </b> Voting is complete, and this RFC has been ";
var RFC_APP_DEV_FOOTER           = "<br><br><b>Action: </b> As the Change Owner, please take note of the voting result.";
var RFC_PAST_IMP_DATE_HEADER     = "<br><b>Event: </b> The RFC is 3 days beyonds its <b><u>Planned End Date</u></b> and is not yet closed.";
var RFC_PAST_IMP_DATE_FOOTER     = "<br><br><b>Action: </b> As the Change Owner, please <b><u>Close</u></b> the RFC or update the Planned End Date.";
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
  bResult = false;
  if (!bResult) {bResult = notifyCancelled                  (prevChange,newChange,notificationContext);}
  if (!bResult) {bResult = notifyPlannedStartEnd            (prevChange,newChange,notificationContext);}
  if (!bResult) {bResult = notifyApprovalRequested          (prevChange,newChange,notificationContext);}
  if (!bResult) {bResult = notifyNewToOpen                  (prevChange,newChange,notificationContext);}
  if (!bResult) {bResult = notifyNewToScheduled             (prevChange,newChange,notificationContext);}
  if (!bResult) {bResult = notifyPendingApprovalToScheduled (prevChange,newChange,notificationContext);}
  if (!bResult) {bResult = notifyScheduledToClosed          (prevChange,newChange,notificationContext);}
  if (!bResult) {bResult = notifyScheduledToImplemented     (prevChange,newChange,notificationContext);}
  if (!bResult) {bResult = notifyImplementedToClosed        (prevChange,newChange,notificationContext);}
  if (!bResult) {bResult = notifyTypeChanged                (prevChange,newChange,notificationContext);}
  if (!bResult) {bResult = notifyAssignmentChanged          (prevChange,newChange,notificationContext);}
  logger.info(sLog + " *** getUsersToNotify Exit ***");
}

function notifyCancelled(prevChange,newChange,notificationContext) {
//-----------------------------------------------------------------------------
// Notification for Change Is Cancelled
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog+" ### notifyCancelled Entry ###");
  if (prevChange!=null) {
    oNewRO = newChange.getField("review-outcome");
    if ( oNewRO.equals(OUTCOME_WITHDRAWN) || oNewRO.equals(OUTCOME_CANCELLED) ) {
      bAdded = false;
      aField = ["cnw-originator-account","cnw-initiated-by-account","cnw-change-owner-account","cnw-implementor-account"];
      for( i=0 ; i<aField.length ; i++ ) {
        sData = newChange.getField(aField[i]);
        if ( !(sData.equals(null) || sData.equals("")) ) {
          logger.info(" - adding "+aField[i]+" to notification -> " + sData) ; notificationContext.addUser(sData);
          bAdded = true;
        } else {
          logger.info(" # ERROR # "+aField[i]+" is null");
        }
      }
      if (bAdded) {
        sEvtText = "The RFC has been <b><u>Cancelled</u></b>!";
        sActText = "As the <b>Submitter</b>, <b>Originator</b>, <b>Change Owner</b>, or <b>Implementor</b>, please take note that this RFC has been <b>Cancelled</b>.";
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
  oNewPhase = newChange.getField("status")             ; oOldPhase = (prevChange!=null) ? prevChange.getField("status")             : "";
  oPSNew    = newChange.getField("planned-start-time") ; oPSOld    = (prevChange!=null) ? prevChange.getField("planned-start-time") : "";
  oPENew    = newChange.getField("planned-end-time")   ; oPEOld    = (prevChange!=null) ? prevChange.getField("planned-end-time")   : "";
  if ( prevChange!=null && oNewPhase.equals(oOldPhase) ) {
    if ( !oPSNew.equals(oPSOld) || !oPENew.equals(oPEOld) ) {
      bAdded = false;
      if ( oNewPhase.equals(STATUS_OPEN) || oNewPhase.equals(STATUS_PENDING_APPROVAL) || oNewPhase.equals(STATUS_PENDING_ACCEPTANCE) || oNewPhase.equals(STATUS_SCHEDULED) ) {
        aField = ["cnw-originator-account","cnw-initiated-by-account","cnw-change-owner-account"];
        for( i=0 ; i<aField.length ; i++ ) {
          sData = newChange.getField(aField[i]) ; logger.info(" - adding "+aField[i]+" to notification -> " + sData) ; notificationContext.addUser(sData);
        }
        bAdded = true;
      }
      if ( oNewPhase.equals(STATUS_PENDING_APPROVAL) || oNewPhase.equals(STATUS_PENDING_ACCEPTANCE) ) {
        sField = "cnw-change-owner-account"; 
        sData = newChange.getField(sField) ; logger.info(" - adding "+sField+" to notification -> " + sData) ; notificationContext.addUser(sData);
      }
      if ( oNewPhase.equals(STATUS_SCHEDULED) ) {
        aField = ["cnw-implementor-account","cw-implementing-team"];
        for( i=0 ; i<aField.length ; i++ ) {
          sData = newChange.getField(aField[i]);
          if (sData!=null) {
            logger.info(" - adding "+aField[i]+" to notification -> " + sData) ; notificationContext.addUser(sData);
          }
        }
      }
      if (bAdded) {
        sEvtText = "The <b>Planned Start/End</b> of the RFC has <b>changed</b>!";
        sActText = "As a person or team associated to this RFC, please take note of the change and <b>plan accordingly</b>.";
        sActFont = "red";
        sEvtTable = "<table>";
        if( !oPSNew.equals(oPSOld) ) {
          sEvtTable += "<tr><td class=\"chl\" width=\"25%\">New Planned Start:</td><td class=\"ctext\">"+DOut(oPSNew)+"</td></tr>";
          sCorP = "Previous";
        } else {
          sCorP = "Current";
        }
        sEvtTable += "<tr><td class=\"chl\" width=\"25%\">"+sCorP+" Planned Start:</td> <td class=\"ctext\">"+DOut(oPSOld)+"</td></tr>";
        sEvtTable += "<tr><td>&nbsp;</td></tr>";
        if( !oPENew.equals(oPEOld) ) {
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
  if ( prevChange!=null && !oNewPhase.equals(oOldPhase) ) {
     if ( !oPSNew.equals(oPSOld) || !oPENew.equals(oPEOld) ) {
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
  oNewType = newChange.getField("category") ; oNewPhase = newChange.getField("status") ; oOldPhase = (prevChange==null) ? "" : prevChange.getField("status"); 
  if (oNewType.equals("Normal") || oNewType.equals("Emergency") || oNewType.equals("Standard")) {
    if ( prevChange==null || !oOldPhase.equals(STATUS_PENDING_APPROVAL) ) {
      if ( oNewPhase.equals(STATUS_PENDING_APPROVAL) ) {
        bAdded = false;
        aAGrps = newChange.getField("cnw-pending-approval-groups").split(",");
        for ( i=0 ; i<aAGrps.length ; i++ ) {
          if ( !(aAGrps[i].equals(null) || aAGrps[i].equals("")) ) {
            logger.info(" - adding Approval Group to notification -> " + aAGrps[i]);
            notificationContext.addUser(aAGrps[i]);
            bAdded = true;
          }
        }
        if ( newChange.getField("cnw-cab-level").equals("Enterprise") ) {
          sECabDL = "CA - IT ITSM Enterprise CAB";
          logger.info(" - adding ECAB Approval Group to notification -> " + sECabDL);
          notificationContext.addUser(sECabDL);
          bAdded = true;
        }
        if (bAdded) {
          sEvtText = "The RFC <b>requires approval</b> from your team!";
          sActText = "As a designated <b>Change Approver</b> for your team, please <b>review the RFC for approval</b>.";
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
// Notification for New To Open (6)
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog + " ### notifyNewToOpen Entry ###");
  sEvtText = "A new RFC has transitioned from <b><u>New</u></b> to <b><u>Open.</u>" ; sActFont = "red";
  oNewType = newChange.getField("category") ; oNewPhase = newChange.getField("status") ; oOldPhase = (prevChange==null) ? "" : prevChange.getField("status"); 
  if ( oNewType.equals("Normal") || oNewType.equals("Emergency") ) {
    if ( prevChange==null && oNewPhase.equals(STATUS_OPEN) && !oNewPhase.equals(oOldPhase) ) {
      bNoCTL = false;
      aField = ["cnw-team-lead-account","cnw-originator-account","cnw-initiated-by-account"];
      for( i=0 ; i<aField.length ; i++ ) {
        sData = newChange.getField(aField[i]);
        if ( !(sData.equals(null) || sData.equals("")) ) {
          logger.info(" - adding "+aField[i]+" to notification -> " + sData) ; notificationContext.addUser(sData);
        } else {
          logger.info(" # ERROR # "+aField[i]+" is null");
          if (i==0) {bNoCTL = true;}
        }
      }
      if (bNoCTL) {
        sActText = "There was NO <b>Change Team Lead</b> identified for this RFC.  One needs to be identified to assess the RFC and prepare it for review.";
      } else {
        sActText = "The <b>Change Team Lead</b> ("+newChange.getField("cnw-change-manager")+") identified for this RFC needs to <b>taka gander at da RFC an pare'it fur raview.";
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
// Notification for standard changes moving from New to Scheduled (7)
//-----------------------------------------------------------------------------
sLog = newChange.getField("request-id");
  logger.info(sLog+" ### notifyNewToScheduled Entry ###");
  oNewType = newChange.getField("category") ; oNewPhase = newChange.getField("status") ; oOldPhase = (prevChange==null) ? "" : prevChange.getField("status"); 
  if ( oNewType.equals("Standard") && oNewPhase.equals(STATUS_SCHEDULED) ) {
    if ( prevChange!=null || !oNewPhase.equals(oOldPhase) ) {
      bAdded = false;
      aField = ["cnw-originator-account","cnw-initiated-by-account","cnw-change-owner-account"];
      for( i=0 ; i<aField.length ; i++ ) {
        sData = newChange.getField(aField[i]) ; logger.info(" - adding "+aField[i]+" to notification -> " + sData) ; notificationContext.addUser(sData);
      }
      sIAName  = newChange.getField("cw-implementor");
      sIAField = "cnw-implementor-account" ; sIAData = newChange.getField(sIAField); 
      sITField = "cw-implementing-team"    ; sITData = newChange.getField(sITField);
      if ( !(sIAData.equals(null) || sIAData.equals("")) ) {
        logger.info(" - adding "+sIAField+" to notification -> " + sIAData) ; notificationContext.addUser(sIAData);
        bAdded = true; 
        sTitle = "Change Implementor";
        sTFill = sIAName;
      } else if ( !(sITData.equals(null) || sITData.equals("")) ) {
        logger.info(" - adding "+sITField+" to notification -> " + sITData) ; notificationContext.addUser(sITData);
        bAdded = true; 
        sTitle = "Change Implementing Team";
        sTFill = sITData;
      }
      sEvtText  =  "The Standard RFC has been <b><u>Scheduled</u></b> for implementation!";
      sActText  =  "As the <b>"+sTitle+"</b> ("+sTFill+"), please take note of the <b>Planned Start</b> (see below) and plan accordingly.";
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
// Notification for changes moving from pending approval to scheduled (8)
//-----------------------------------------------------------------------------
  sLog = newChange.getField("request-id");
  logger.info(sLog + " ### notifyPendingApprovalToScheduled Entry ###");
  oNewType = newChange.getField("category") ; oNewPhase = newChange.getField("status") ; oOldPhase = (prevChange==null) ? "" : prevChange.getField("status"); 
  if ( oNewType.equals("Normal") || oNewType.equals("Emergency") ) {
    if ( prevChange!=null && oNewPhase.equals(STATUS_SCHEDULED) && oOldPhase.equals(STATUS_PENDING_APPROVAL) ) {
      bAdded = false;
      sIAName  = newChange.getField("cw-implementor");
      sIAField = "cnw-implementor-account" ; sIAData = newChange.getField(sIAField); 
      sITField = "cw-implementing-team"    ; sITData = newChange.getField(sITField);
      if ( !(sIAData.equals(null) || sIAData.equals("")) ) {
        logger.info(" - adding "+sIAField+" to notification -> " + sIAData) ; notificationContext.addUser(sIAData);
        bAdded = true; 
        sTitle = "Change Implementor";
        sTFill = sIAName;
      } else if ( !(sITData.equals(null) || sITData.equals("")) ) {
        logger.info(" - adding "+sITField+" to notification -> " + sITData) ; notificationContext.addUser(sITData);
        bAdded = true; 
        sTitle = "Change Implementing Team";
        sTFill = sITData;
      }
      sEvtText  =  "The RFC has been <b>Approved</b> and is now <b><u>Scheduled</u></b> for implementation.";
      sActText  =  "As the <b>"+sTitle+"</b> ("+sTFill+"), please take note of the <b>Planned Start</b> (see below) and plan accordingly.";
      sActFont  =  "red";
      if (bAdded) {
        notificationContext.setMessage( MsgCompile(sEvtText,sActText,sActFont) );
        logger.info(sLog+" ### notifyNewToScheduled Exit true ###");
        return true;
      }
	  logger.info(" # ERROR # cnw-implementor-account and cw-implementing-team are null -> Cancelling pending approval to scheduled notification!");
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
  oNewType = newChange.getField("category") ; oNewPhase = newChange.getField("status") ; oOldPhase = (prevChange==null) ? "" : prevChange.getField("status"); 
  if ( oNewType.equals("Standard") || oNewPhase.equals(STATUS_CLOSED) ) {
    if ( prevChange!=null || !oNewPhase.equals(oOldPhase) ) {
      sName  = newChange.getField("contact-person");
      sField = "cnw-change-owner-account";
	  sData  = newChange.getField(sIAField); 
      if ( !(sData.equals(null) || sData.equals("")) ) {
        sTitle    = "Change Owner";
        sTFill    = sName;
        sEvtText  =  "The RFC phase has changed from <b><u>Scheduled</u></b> to <b><u>Closed</u></b>.";
        sActText  =  "As the <b>"+sTitle+"</b> ("+sTFill+"), please take note that this RFC has been <b><u>Closed</u></b>";
        sActFont  =  "red";
        notificationContext.setMessage( MsgCompile(sEvtText,sActText,sActFont) );
        logger.info(sLog+" ### notifyNewToScheduled Exit true ###");
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
  oNewType = newChange.getField("category") ; oNewPhase = newChange.getField("status") ; oOldPhase = (prevChange==null) ? "" : prevChange.getField("status"); 
  if ( oNewType.equals("Normal") || oNewType.equals("Emergency") || oNewType.equals("Standard") ) {
    if ( prevChange!=null && oNewPhase(STATUS_IMPLEMENTED) && oOldPhase.equals(STATUS_SCHEDULED) ) {
      sName  = newChange.getField("contact-person");
      sField = "cnw-change-owner-account";
	  sData  = newChange.getField(sIAField); 
      if ( !(sData.equals(null) || sData.equals("")) ) {
        sTitle    = "Change Owner";
        sTFill    = sName;
        sEvtText  =  "The RFC phase has changed from <b><u>Scheduled</u></b> to <b><u>Implemented</u></b>.";
        sActText  =  "As the <b>"+sTitle+"</b> ("+sTFill+"), please validate the RFC has been implemented as expected and then transition it to <b><u>Closed</u></b>.";
        sActFont  =  "red";
        notificationContext.setMessage( MsgCompile(sEvtText,sActText,sActFont) );
        logger.info(sLog+" ### notifyNewToScheduled Exit true ###");
        return true;
      }
      logger.info(" # ERROR # cnw-change-owner-account is null -> Cancelling scheduled to implemented notification!");
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
  oNewType = newChange.getField("category") ; oNewPhase = newChange.getField("status") ; oOldPhase = (prevChange==null) ? "" : prevChange.getField("status"); 
  if ( oNewType.equals("Normal") || oNewType.equals("Emergency") || oNewType.equals("Standard") ) {
    if ( prevChange!=null && oNewPhase(STATUS_CLOSED) && oOldPhase.equals(STATUS_IMPLEMENTED) ) {
      sName  = newChange.getField("contact-person");
      sField = "cnw-change-owner-account";
	  sData  = newChange.getField(sIAField); 
      if ( !(sData.equals(null) || sData.equals("")) ) {
        sTitle    = "Change Owner";
        sTFill    = sName;
        sEvtText  =  "The RFC phase has changed from <b><u>Implemented</u></b> to <b><u>Closed</u></b>.";
        sActText  =  "As the <b>"+sTitle+"</b> ("+sTFill+"), please take note that this RFC has been <b><u>Closed</u></b>.";
        sActFont  =  "red";
        notificationContext.setMessage( MsgCompile(sEvtText,sActText,sActFont) );
        logger.info(sLog+" ### notifyNewToScheduled Exit true ###");
        return true;
      }
      logger.info(" # ERROR # cnw-change-owner-account is null -> Cancelling implemented to closed notification!");
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
  oNewType  = newChange.getField("category") ; oOldType  = (prevChange==null) ? "" : prevChange.getField("category"); 
  if ( oNewType.equals("Normal") || oNewType.equals("Emergency") || oNewType.equals("Standard") ) {
    if ( prevChange!=null && !oNewType.equals(oOldType) ) {
      sName  = newChange.getField("contact-person");
      sField = "cnw-change-owner-account";
	  sData  = newChange.getField(sIAField); 
      if ( !(sData.equals(null) || sData.equals("")) ) {
        sTitle    = "Change Owner";
        sTFill    = sName;
        sEvtText  =  "The RFC type has changed from <b><u>"+oOldType+"</u></b> to <b><u>"+oNewType+"</u></b>.";
        sActText  =  "As the <b>"+sTitle+"</b> ("+sTFill+"), please take note that this change has occurred, as it may impact on your planning.";
        sActFont  =  "red";
        notificationContext.setMessage( MsgCompile(sEvtText,sActText,sActFont) );
        logger.info(sLog+" ### notifyNewToScheduled Exit true ###");
        return true;
      }
      logger.info(" # ERROR # cnw-change-owner-account is null -> Cancelling type changed notification!");
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
  oNewAT  = newChange.getField("cnw-assigned-to") ; oOldAT  = (prevChange==null) ? "" : prevChange.getField("cnw-assigned-to"); 
  if ( prevChange!=null && !(oNewAT.equals(null) || oNewAT.equals("") || oOldAT.equals(null) || oOldAT.equals("")) ) {
    sName = newChange.getField("cnw-assigned-to") ; sField = "cnw-assigned-to-account" ; sData = newChange.getField(sIAField); 
    if ( !(sData.equals(null) || sData.equals("")) ) {
      sTitle    = "Assigned To";
      sTFill    = sName;
      sEvtText  =  "The RFC has had the <b>Assigned To</b> changed from <b><u>"+oOldAT+"</u></b> to <b><u>"+oNewAT+"</u></b>.";
      sActText  =  "As the <b>"+sTitle+"</b> ("+sTFill+"), please take note of the assignment change and check if <b>you may have a task to complete</b>.";
      sActFont  =  "red";
      notificationContext.setMessage( MsgCompile(sEvtText,sActText,sActFont) );
      logger.info(sLog+" ### notifyNewToScheduled Exit true ###");
      return true;
    }
    logger.info(" # ERROR # cnw-assigned-to-account is null -> Cancelling assignment changed notification!");
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