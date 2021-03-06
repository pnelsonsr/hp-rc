// -------------------------------------------------------------------------------------
   name      =  "change-flow.js" ;
   version   =  "0.2.7a1"        ;
   revision  =  "2010-203"       ;
// -------------------------------------------------------------------------------------
//  Functions for RFC Notification 
// -------------------------------------------------------------------------------------

importPackage(Packages.org.apache.commons.beanutils);
importPackage(Packages.java.util);

//-----------------------------------------------------------------------------
// Variable Assignment Begin
//-----------------------------------------------------------------------------

//--------------------------
// Variable Assignment End
//--------------------------

function preChangeProcess(oaOld,oaNew) {
//-----------------------------------------------------------------------------
// Does Nothing
//-----------------------------------------------------------------------------
}

function postChangeProcess(oaOld,oaNew) {
//-----------------------------------------------------------------------------
// Does Nothing
//-----------------------------------------------------------------------------
}

function shouldAnalyze(oaOld,oaNew) {
//-----------------------------------------------------------------------------
// OOB
//-----------------------------------------------------------------------------
  sLog = oaNew.getField("request-id");
  logger.info(sLog + " *** shouldAnalyze Entry ***");
  bResult = false;
  if (oaNew.isInitialLoadState()) {
    bResult = true;
  }
  if (oaNew.isTicketAnalyzer()) {
    bResult = true;
  }
  if (!bResult) {
    bResult = !(oaNew.isAnalysisRulesEqual(oaOld));
  }
  logger.info(sLog + " *** shouldAnalyze Exit " + bResult + " ***");
  return bResult;
}

function shouldCalcImpact(oaOld,oaNew) {
//-----------------------------------------------------------------------------
// OOB
//-----------------------------------------------------------------------------
  sLog = oaNew.getField("request-id");
  logger.info(sLog + " *** shouldCalcImpact Entry ***");
  if ( oaNew.isInitialLoadState() ) {
    logger.info(sLog + " - change is initial load state");
    logger.info(sLog + " *** shouldCalcImpact Exit true ***");
    return true;
  }
  var oaNewValidStatus = isStatusValid4Calc(oaNew);
  var oaOldValidStatus = isStatusValid4Calc(oaOld);
  if (oaOld==null) {
    logger.info(sLog + " *** shouldCalcImpact Exit true ***");
    return true;
  }
  if (!oaOldValidStatus && oaNewValidStatus) {
    logger.info(sLog + " *** shouldCalcImpact Exit true ***");
    return true;
  } else if ( !oaNew.isAnalyzedCisEquals(oaOld) ) { 
    logger.info(sLog + " *** shouldCalcImpact Exit " + oaNewValidStatus + " ***");
    return oaNewValidStatus;
  }
  logger.info(sLog + " *** shouldCalcImpact Exit " + oaNewValidStatus + " ***");
  return oaNewValidStatus;
}

function preCalcRisk(oaOld,oaNew) {
//-----------------------------------------------------------------------------
// This script is called after shouldCalcRisk return true and before risk 
// calculation / re-calculation,
// Does Nothing
//-----------------------------------------------------------------------------
}

function shouldCalcRisk(oaOld,oaNew) {
//-----------------------------------------------------------------------------
// Note - this script is also called in risk recalculation
//-----------------------------------------------------------------------------
  sLog = oaNew.getField("request-id");
  logger.info(sLog + " *** shouldCalcRisk Entry ***");
  var shouldCalc = isStatusValid4Calc(oaNew);
  logger.info(sLog + " *** shouldCalcRisk Exit "+shouldCalc+" ***");
  return shouldCalc;
}

function overrideRisk(oaOld,oaNew,analysis,result) {
//--------------------------------------------------------------
// Script that allows overriding the standard risk calculation.
// The reasons for overriding the risk should be returned using 
// the result.addRule("") API.
// Does Nothing
//--------------------------------------------------------------
}

function shouldCalcCollision(oaOld,oaNew) {
//----------------------------------------------------------------------------
// Script that allows to define for which changes the collisions will be 
// calculated. Should be used as a fuse, only in order to prevent performance 
// problems with problematic changes. Like a change that spans over 2 months 
// and will collide with thousands of changes.
// Returns true for every call
//----------------------------------------------------------------------------
  return true;
}

function addActionItemsOnChange(oaOld,oaNew,actionItemsContext) {
//--------------------------------------------------------------------------
// Returns false for every call
//--------------------------------------------------------------------------
  return false;
}

function getUsersToNotify(oaOld,oaNew,oaNotify) {
//-----------------------------------------------------------------------------
// used for notification email processing * This controls it all *
//-----------------------------------------------------------------------------
  sLog = oaNew.getField("request-id");
  logger.info(sLog+" *** getUsersToNotify Entry ***");
  logger.info(sLog+" ### "+name+" version "+version+" revision "+revision+" ###");
  bResult = false;
  if (!bResult) {bResult = notifyTest                       (oaOld,oaNew,oaNotify);}
  if (!bResult) {bResult = notifyCancelled                  (oaOld,oaNew,oaNotify);}
  if (!bResult) {bResult = notifyPlannedStartEnd            (oaOld,oaNew,oaNotify);}
  if (!bResult) {bResult = notifyApprovalRequested          (oaOld,oaNew,oaNotify);}
  if (!bResult) {bResult = notifyAcceptanceRequested        (oaOld,oaNew,oaNotify);}
  if (!bResult) {bResult = notifyNewToOpen                  (oaOld,oaNew,oaNotify);}
  if (!bResult) {bResult = notifyNewToScheduled             (oaOld,oaNew,oaNotify);}
  if (!bResult) {bResult = notifyPendingApprovalToScheduled (oaOld,oaNew,oaNotify);}
  if (!bResult) {bResult = notifyScheduledToClosed          (oaOld,oaNew,oaNotify);}
  if (!bResult) {bResult = notifyScheduledToImplemented     (oaOld,oaNew,oaNotify);}
  if (!bResult) {bResult = notifyImplementedToClosed        (oaOld,oaNew,oaNotify);}
  if (!bResult) {bResult = notifyTypeChanged                (oaOld,oaNew,oaNotify);}
  if (!bResult) {bResult = notifyAssignmentChanged          (oaOld,oaNew,oaNotify);}
  if (!bResult) {bResult = notifyPlannedOverdue             (oaOld,oaNew,oaNotify);}
  logger.info(sLog + " *** getUsersToNotify Exit ***");
}

function notifyTest(oaOld,oaNew,oaNotify) {
//-----------------------------------------------------------------------------
// Notification for development testing
//-----------------------------------------------------------------------------
  //var bDisplay = true;
  var bDisplay = false;
  if (bDisplay) {
    sLog = oaNew.getField("request-id");
    logger.info(sLog+" ### notifyTest Entry ###");
    //-- display -- start
    oNewNofify = oaNew.getField("cnw-planned-overdue");
    logger.info(" - Display field value for cnw-planned-overdue -> "+oNewNofify);
    if (oNewNofify.equals("Yes")) {
      logger.info(" -- True ");
    } else {
      logger.info(" -- False ");
    }
    oNewDays = oaNew.getField("cnw-planned-days");
    logger.info(" - Display field value for cnw-planned-days -> "+oNewDays);
    if (oNewDays > 0) {
      logger.info(" -- Greater than Zero");
    } else {
      logger.info(" -- Less than or Equals Zero");
    }
    //-- display -- end
    logger.info(sLog+" ### notifyTest Exit false ###");
  }
  return false;
}

function notifyCancelled(oaOld,oaNew,oaNotify) {
//-----------------------------------------------------------------------------
// Notification for Change Is Cancelled
//-----------------------------------------------------------------------------
  sLog = oaNew.getField("request-id");
  logger.info(sLog+" ### notifyCancelled Entry ###");
  if (oaOld!=null) {
    oNewRO = oaNew.getField("review-outcome");
    if ( oNewRO.equals(OUTCOME_WITHDRAWN) || oNewRO.equals(OUTCOME_CANCELLED) ) {
      bAdded = false;
      aField = ["cnw-originator-account","cnw-initiated-by-account","cnw-change-owner-account"];
      for( i=0 ; i<aField.length ; i++ ) {
        sData = oaNew.getField(aField[i]);
        if ( isNotBlank(sData) ) {
          logger.info(" - adding "+aField[i]+" to notification -> " + sData) ; oaNotify.addUser(sData);
          bAdded = true;
        } else {
          logger.info(" # ERROR # "+aField[i]+" is null");
        }
      }
      bImpAdd  = false;
      sIAField = "cnw-implementor-account" ; sIAData = oaNew.getField(sIAField); 
      sITField = "cw-implementing-team"    ; sITData = oaNew.getField(sITField);
      if ( isNotBlank(sIAData) ) {
        bImpAdd = true ; sField = sIAField ; sData = sIAData ; bAdded = true; 
      } else if ( isNotBlank(sITData) ) {
        bImpAdd = true ; sField = sITField ; sData = sITData ; bAdded = true; 
      }
      if (bImpAdd) {
        logger.info(" - adding "+sField+" to notification -> " + sData) ; oaNotify.addUser(sData);
      }
      if (bAdded) {
        sEvtText = "The RFC has been <b><u>Cancelled</u></b>!";
        sActText = "As the <b>Submitter</b>, <b>Originator</b>, <b>Change Owner</b>, or <b>Implementor</b>, please take note that this RFC has been <b>Cancelled</b>.";
        oaNotify.setMessage(msgCreate(sEvtText,sActText));
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

function notifyPlannedStartEnd(oaOld,oaNew,oaNotify) {
//-----------------------------------------------------------------------------
// Notification for Change Planned Start/End Date-Time Changed
//-----------------------------------------------------------------------------
  sLog = oaNew.getField("request-id");
  logger.info(sLog + " ### notifyPlannedDate Entry ###");
  oNewPhase = oaNew.getField("status")             ; oOldPhase = (oaOld!=null) ? oaOld.getField("status")             : "";
  oPSNew    = oaNew.getField("planned-start-time") ; oPSOld    = (oaOld!=null) ? oaOld.getField("planned-start-time") : "";
  oPENew    = oaNew.getField("planned-end-time")   ; oPEOld    = (oaOld!=null) ? oaOld.getField("planned-end-time")   : "";
  if ( oaOld!=null && oNewPhase.equals(oOldPhase) ) {
    if ( !oPSNew.equals(oPSOld) || !oPENew.equals(oPEOld) ) {
      bAdded = false ; bImpAdd = false;
      if ( oNewPhase.equals(STATUS_OPEN) || oNewPhase.equals(STATUS_PENDING_APPROVAL) || oNewPhase.equals(STATUS_PENDING_ACCEPTANCE) || oNewPhase.equals(STATUS_SCHEDULED) ) {
        aField = ["cnw-originator-account","cnw-initiated-by-account","cnw-change-owner-account"];
        for( i=0 ; i<aField.length ; i++ ) {
          sData = oaNew.getField(aField[i]) ; logger.info(" - adding "+aField[i]+" to notification -> " + sData) ; oaNotify.addUser(sData) ; bAdded = true;
        }
      }
      if ( oNewPhase.equals(STATUS_PENDING_APPROVAL) || oNewPhase.equals(STATUS_PENDING_ACCEPTANCE) || oNewPhase.equals(STATUS_SCHEDULED) ) {
        sField = "cnw-team-lead-account"; 
        sData = oaNew.getField(sField) ; logger.info(" - adding "+sField+" to notification -> " + sData) ; oaNotify.addUser(sData);
      }
      if ( oNewPhase.equals(STATUS_SCHEDULED) ) {
        sIAName  = oaNew.getField("cw-implementor");
        sIAField = "cnw-implementor-account" ; sIAData = oaNew.getField(sIAField); 
        sITField = "cw-implementing-team"    ; sITData = oaNew.getField(sITField);
        if ( isNotBlank(sIAData) ) {
          bImpAdd = true ; bAdded = true ; sField = sIAField ; sData = sIAData ; sTFill = sIAName ; sTitle = "Change Implementor";
        } else if ( isNotBlank(sITData) ) {
          bImpAdd = true ; bAdded = true ; sField = sITField ; sData = sITData ; sTFill = sData   ; sTitle = "Change Implementing Team";
        }
        if (bImpAdd) {
          logger.info(" - adding "+sField+" to notification -> " + sData) ; oaNotify.addUser(sData);
        }
      }
      if (bAdded) {
        sEvtText = "The <b>Planned Start/End</b> of the RFC has <b>changed</b>!";
        sActText = "As a person or team associated to this RFC, please take note of the change and <b>plan accordingly</b>.";
        sActFont = "red";
        sEvtTable = "<table>";
        if( !oPSNew.equals(oPSOld) ) {
          sEvtTable += "<tr><td class=\"chl\" width=\"25%\">New Planned Start:</td><td class=\"ctext\">"+dOut(oPSNew)+"</td></tr>";
          sCorP = "Previous";
        } else {
          sCorP = "Current";
        }
        sEvtTable += "<tr><td class=\"chl\" width=\"25%\">"+sCorP+" Planned Start:</td> <td class=\"ctext\">"+dOut(oPSOld)+"</td></tr>";
        sEvtTable += "<tr><td>&nbsp;</td></tr>";
        if( !oPENew.equals(oPEOld) ) {
          sEvtTable += "<tr><td class=\"chl\" width=\"25%\">New Planned End:</td><td class=\"ctext\">"+dOut(oPENew)+"</td></tr>";
          sCorP = "Previous";
        } else {
          sCorP = "Current";
        }
        sEvtTable += "<tr><td class=\"chl\" width=\"25%\">"+sCorP+" Planned End:</td><td class=\"ctext\">"+dOut(oPEOld)+"</td></tr>";
        sEvtTable += "</table>";
        sEvtTable += "<br>";
        oaNotify.setMessage(msgCreate(sEvtText,sActText,sActFont,sEvtTable));
        logger.info(sLog + " ### notifyPlannedDate Exit true ###");
        return true;
      }
    }
  } 
  if ( oaOld!=null && !oNewPhase.equals(oOldPhase) ) {
     if ( !oPSNew.equals(oPSOld) || !oPENew.equals(oPEOld) ) {
       logger.info(" - Planned Start/End and Phase has changed. Phase has precedence! -> exiting");
     }
  }
  logger.info(sLog + " ### notifyPlannedDate Exit false ###");
  return false;
}

function notifyApprovalRequested(oaOld,oaNew,oaNotify) {
//-----------------------------------------------------------------------------
// Notification for cnw-pending-approval-groups -> Normal & Emergency
//-----------------------------------------------------------------------------
  sLog = oaNew.getField("request-id");
  logger.info(sLog+" ### notifyApprovalRequested Entry ###");
  oNewType = oaNew.getField("category") ; oNewPhase = oaNew.getField("status") ; oOldPhase = (oaOld==null) ? "" : oaOld.getField("status") ; oNewCAB = oaNew.getField("cnw-cab-level");
  if ( !oNewType.equals("Unplanned") && oNewPhase.equals(STATUS_PENDING_APPROVAL) && !oNewPhase.equals(oOldPhase) ) {
    bAdded = false;
    aPAGrps = oaNew.getField("cnw-pending-approval-groups").split(",");
    for ( i=0 ; i<aPAGrps.length ; i++ ) {
      if ( isNotBlank(aPAGrps[i]) ) {
        logger.info(" - adding Pending Approval Group to notification -> " + aPAGrps[i]) ; oaNotify.addUser(aPAGrps[i]) ; bAdded = true;
      }
    }
    if ( oNewCAB.equals("Enterprise") || oNewCAB.equals("Emergency") ) {
      aFAGrps = oaNew.getField("approvals-required").split(",");
      for ( i=0 ; i<aFAGrps.length ; i++ ) {
        if ( isNotBlank(aFAGrps[i]) ) {
          logger.info(" - adding Future Approval Group to notification -> " + aFAGrps[i]) ; oaNotify.addUser(aFAGrps[i]) ; bAdded = true;
        }
      }
    }
    if (bAdded) {
      sEvtText = "The RFC <b>requires approval</b> from your team!";
      sActText = "As a designated <b>Change Approver</b> for your team, please <b>review the RFC for approval</b>.";
      sActFont = "red";
      oaNotify.setMessage(msgCreate(sEvtText,sActText,sActFont));
      logger.info(sLog+" ### notifyApprovalRequested Exit true ###");
      return true;
    } else {
      logger.info(" # ERROR # No Approval Groups to add! -> exiting");
    }
  }
  logger.info(sLog+" ### notifyApprovalRequested Exit false ###");
  return false;
}

function notifyAcceptanceRequested(oaOld,oaNew,oaNotify) {
//-----------------------------------------------------------------------------
// Notification for cnw-pending-approval-groups -> Unplanned
//-----------------------------------------------------------------------------
  sLog = oaNew.getField("request-id");
  logger.info(sLog+" ### notifyAcceptanceRequested Entry ###");
  oNewType = oaNew.getField("category") ; oNewPhase = oaNew.getField("status") ; oOldPhase = (oaOld==null) ? "" : oaOld.getField("status") ; oNewCAB = oaNew.getField("cnw-cab-level");
  if ( oNewType.equals("Unplanned") && oNewPhase.equals(STATUS_PENDING_ACCEPTANCE) && !oNewPhase.equals(oOldPhase) ) {
    bAdded = false;
    aPAGrps = oaNew.getField("cnw-pending-approval-groups").split(",");
    for ( i=0 ; i<aPAGrps.length ; i++ ) {
      if ( isNotBlank(aPAGrps[i]) ) {
        logger.info(" - adding Pending Approval Group to notification -> " + aPAGrps[i]) ; oaNotify.addUser(aPAGrps[i]) ; bAdded = true;
      }
    }
    if ( oNewCAB.equals("Enterprise") ) {
      aFAGrps = oaNew.getField("approvals-required").split(",");
      for ( i=0 ; i<aFAGrps.length ; i++ ) {
        if ( isNotBlank(aFAGrps[i]) ) {
          logger.info(" - adding Future Approval Group to notification -> " + aFAGrps[i]) ; oaNotify.addUser(aFAGrps[i]) ; bAdded = true;
        }
      }
    }
    if (bAdded) {
      sEvtText = "The Unplanned RFC <b>requires Acceptance</b> from your team!";
      sActText = "As a designated <b>Change Approver</b> for your team, please <b>review the Unplanned RFC for acceptance</b>.";
      sActFont = "red";
      oaNotify.setMessage(msgCreate(sEvtText,sActText,sActFont));
      logger.info(sLog+" ### notifyAcceptanceRequested Exit true ###");
      return true;
    } else {
      logger.info(" # ERROR # No Approval Groups to add! -> exiting");
    }
  }
  logger.info(sLog+" ### notifyAcceptanceRequested Exit false ###");
  return false;
}

function notifyNewToOpen(oaOld,oaNew,oaNotify) {
//-----------------------------------------------------------------------------
// Notification for New To Open
//-----------------------------------------------------------------------------
  sLog = oaNew.getField("request-id");
  logger.info(sLog + " ### notifyNewToOpen Entry ###");
  sEvtText = "A new RFC has transitioned from <b><u>New</u></b> to <b><u>Open.</u>" ; sActFont = "red";
  oNewType = oaNew.getField("category") ; oNewPhase = oaNew.getField("status") ; oOldPhase = (oaOld==null) ? "" : oaOld.getField("status"); 
  if ( ( oNewType.equals("Normal") || oNewType.equals("Emergency") ) && oNewPhase.equals(STATUS_OPEN) && !oNewPhase.equals(oOldPhase) ) {
    bNoCTL = false;
    aField = ["cnw-team-lead-account","cnw-originator-account","cnw-initiated-by-account","cnw-change-owner-account"];
    for( i=0 ; i<aField.length ; i++ ) {
      sData = oaNew.getField(aField[i]);
      if ( isNotBlank(sData) ) {
        logger.info(" - adding "+aField[i]+" to notification -> " + sData) ; oaNotify.addUser(sData);
      } else {
        logger.info(" # ERROR # "+aField[i]+" is null");
        if (i==0) {bNoCTL = true;}
      }
    }
    if (bNoCTL) {
      sActText = "There was NO <b>Change Team Lead</b> identified for this RFC.  One needs to be identified to assess the RFC and prepare it for review.";
    } else {
      sActText = "The <b>Change Team Lead</b> ("+oaNew.getField("cnw-change-manager")+") identified for this RFC needs to <b>assess the RFC and prepare it for review.";
    }
    oaNotify.setMessage(msgCreate(sEvtText,sActText,sActFont));
    logger.info(" ### notifyNewToOpen Exit true ###");
    return true;
  }
  logger.info(sLog + " ### notifyNewToOpen Exit false ###");
  return false;
}

function notifyNewToScheduled(oaOld,oaNew,oaNotify) {
//-----------------------------------------------------------------------------
// Notification for standard changes moving from New to Scheduled (7)
//-----------------------------------------------------------------------------
sLog = oaNew.getField("request-id");
  logger.info(sLog+" ### notifyNewToScheduled Entry ###");
  oNewType = oaNew.getField("category") ; oNewPhase = oaNew.getField("status") ; oOldPhase = (oaOld==null) ? "" : oaOld.getField("status"); 
  if ( oNewType.equals("Standard") && oNewPhase.equals(STATUS_SCHEDULED) && !oNewPhase.equals(oOldPhase) ) {
    bAdded = false ; bImpAdd = false;
    aField = ["cnw-originator-account","cnw-initiated-by-account","cnw-change-owner-account"];
    for( i=0 ; i<aField.length ; i++ ) {
      sData = oaNew.getField(aField[i]) ; logger.info(" - adding "+aField[i]+" to notification -> " + sData) ; oaNotify.addUser(sData);
    }
    sIAName  = oaNew.getField("cw-implementor");
    sIAField = "cnw-implementor-account" ; sIAData = oaNew.getField(sIAField); 
    sITField = "cw-implementing-team"    ; sITData = oaNew.getField(sITField);
    if ( isNotBlank(sIAData) ) {
      bImpAdd = true ; bAdded = true ; sField = sIAField ; sData = sIAData ; sTFill = sIAName ; sTitle = "Change Implementor";
    } else if ( isNotBlank(sITData) ) {
      bImpAdd = true ; bAdded = true ; sField = sITField ; sData = sITData ; sTFill = sData   ; sTitle = "Change Implementing Team";
    }
    if (bImpAdd) {
      logger.info(" - adding "+sField+" to notification -> " + sData) ; oaNotify.addUser(sData);
    }
    sEvtText  =  "The Standard RFC has been <b><u>Scheduled</u></b> for implementation!";
    sActText  =  "As the <b>"+sTitle+"</b> ("+sTFill+"), please take note of the <b>Planned Start</b> (see below) and plan accordingly.";
    sActFont  =  "red";
    if (bAdded) {
      oaNotify.setMessage( msgCreate(sEvtText,sActText,sActFont) );
      logger.info(sLog+" ### notifyNewToScheduled Exit true ###");
      return true;
    } else {
       logger.info(" # ERROR # cnw-implementor-account and cw-implementing-team are null -> Cancelling new to scheduled notification!");
    }
  }
  logger.info(sLog+" ### notifyNewToScheduled Exit false ###");
  return false;
}

function notifyPendingApprovalToScheduled(oaOld,oaNew,oaNotify) {
//-----------------------------------------------------------------------------
// Notification for changes moving from pending approval to scheduled (8)
//-----------------------------------------------------------------------------
  sLog = oaNew.getField("request-id");
  logger.info(sLog + " ### notifyPendingApprovalToScheduled Entry ###");
  oNewType = oaNew.getField("category") ; oNewPhase = oaNew.getField("status") ; oOldPhase = (oaOld==null) ? "" : oaOld.getField("status"); 
  if ( ( oNewType.equals("Normal") || oNewType.equals("Emergency") ) && oNewPhase.equals(STATUS_SCHEDULED) && !oNewPhase.equals(oOldPhase) ) {
    bAdded = false ; bImpAdd = false;
    aField = ["cnw-change-owner-account"];
    for( i=0 ; i<aField.length ; i++ ) {
      sData = oaNew.getField(aField[i]) ; logger.info(" - adding "+aField[i]+" to notification -> " + sData) ; oaNotify.addUser(sData) ; bAdded = true; 
    }
    sIAName  = oaNew.getField("cw-implementor");
    sIAField = "cnw-implementor-account" ; sIAData = oaNew.getField(sIAField); 
    sITField = "cw-implementing-team"    ; sITData = oaNew.getField(sITField);
    if ( isNotBlank(sIAData) ) {
      bImpAdd = true ; bAdded = true ; sField = sIAField ; sData = sIAData ; sTFill = sIAName ; sTitle = "Change Implementor";
    } else if ( isNotBlank(sITData) ) {
      bImpAdd = true ; bAdded = true ; sField = sITField ; sData = sITData ; sTFill = sData   ; sTitle = "Change Implementing Team";
    }
    if (bImpAdd) {
      logger.info(" - adding "+sField+" to notification -> " + sData) ; oaNotify.addUser(sData);
    }
    if (bAdded) {
      sEvtText  =  "The RFC has been <b>Approved</b> and is now <b><u>Scheduled</u></b> for implementation.";
      sActText  =  "As the <b>"+sTitle+"</b> ("+sTFill+"), please take note of the <b>Planned Start</b> (see below) and plan accordingly.";
      sActFont  =  "red";
      oaNotify.setMessage( msgCreate(sEvtText,sActText,sActFont) );
      logger.info(sLog+" ### notifyNewToScheduled Exit true ###");
      return true;
    }
    logger.info(" # ERROR # cnw-implementor-account and cw-implementing-team are null -> Cancelling pending approval to scheduled notification!");
  }
  logger.info(sLog + " ### notifyPendingApprovalToScheduled Exit false ###");
  return false;
}

function notifyScheduledToClosed(oaOld,oaNew,oaNotify) {
//-----------------------------------------------------------------------------
// Notification for standard changes moving from Scheduled to Closed
//-----------------------------------------------------------------------------
  sLog = oaNew.getField("request-id");
  logger.info(sLog + " ### notifyScheduledToClosed Entry ###");
  sEvtText = "The RFC phase has changed from <b><u>Scheduled</u></b> to <b><u>Closed</u></b>."; 
  sActText = "Please take note that this RFC has been <b><u>Closed</u></b>";
  sActFont = "red";
  oNewType = oaNew.getField("category") ; oNewPhase = oaNew.getField("status") ; oOldPhase = (oaOld==null) ? "" : oaOld.getField("status"); 
  if ( oNewType.equals("Standard") && oNewPhase.equals(STATUS_CLOSED) && !oNewPhase.equals(oOldPhase) ) {
    bAdded = false; 
    aField = ["cnw-originator-account","cnw-initiated-by-account"];
    for( i=0 ; i<aField.length ; i++ ) {
      sData = oaNew.getField(aField[i]) ; logger.info(" - adding "+aField[i]+" to notification -> " + sData) ; oaNotify.addUser(sData) ; bAdded = true; 
    }
    sField = "cnw-change-owner-account" ; sName = oaNew.getField("contact-person") ; sData = oaNew.getField(sField); 
    if ( isNotBlank(sData) ) {
      logger.info(" - adding "+sField+" to notification -> " + sData) ; oaNotify.addUser(sData) ; bAdded = true;
      sTitle   = "Change Owner" ; sTFill   = sName;
      sActText = "As the <b>"+sTitle+"</b> ("+sTFill+"), please take note that this RFC has been <b><u>Closed</u></b>";
    }
    if (bAdded) {
      oaNotify.setMessage( msgCreate(sEvtText,sActText,sActFont) );
      logger.info(sLog+" ### notifyNewToScheduled Exit true ###");
      return true;
    }
    logger.info(" # ERROR # cnw-change-owner-account is null -> Cancelling scheduled to closed notification!");
  }
  logger.info(sLog + " ### notifyScheduledToClosed Exit false ###");
  return false;
}

function notifyScheduledToImplemented(oaOld,oaNew,oaNotify) {
//-----------------------------------------------------------------------------
// Notification for Scheduled To Implemented
//-----------------------------------------------------------------------------
  sLog = oaNew.getField("request-id");
  logger.info(sLog + " ### notifyScheduledToImplemented Entry ###");
  oNewType = oaNew.getField("category") ; oNewPhase = oaNew.getField("status") ; oOldPhase = (oaOld==null) ? "" : oaOld.getField("status"); 
  if ( ( oNewType.equals("Normal") || oNewType.equals("Emergency") ) && oNewPhase.equals(STATUS_IMPLEMENTED) && !oNewPhase.equals(oOldPhase) ) {
    sField = "cnw-change-owner-account" ; sName = oaNew.getField("contact-person") ; sData = oaNew.getField(sField);    
    if ( isNotBlank(sData) ) {
      logger.info(" - adding "+sField+" to notification -> " + sData) ; oaNotify.addUser(sData);
      sTitle    = "Change Owner" ; sTFill    = sName;
      sEvtText  =  "The RFC phase has changed from <b><u>Scheduled</u></b> to <b><u>Implemented</u></b>.";
      sActText  =  "As the <b>"+sTitle+"</b> ("+sTFill+"), please validate the RFC has been implemented as expected and then transition it to <b><u>Closed</u></b>.";
      sActFont  =  "red";
      oaNotify.setMessage( msgCreate(sEvtText,sActText,sActFont) );
      logger.info(sLog+" ### notifyNewToScheduled Exit true ###");
      return true;
    }
    logger.info(" # ERROR # cnw-change-owner-account is null -> Cancelling scheduled to implemented notification!");
  }
  logger.info(sLog + " ### notifyScheduledToImplemented Exit false ###");
  return false;
}

function notifyImplementedToClosed(oaOld,oaNew,oaNotify) {
//-----------------------------------------------------------------------------
// Notification for Implemented To Closed
//-----------------------------------------------------------------------------
  sLog = oaNew.getField("request-id");
  logger.info(sLog + " ### notifyImplementedToClosed Entry ###");
  sEvtText = "The RFC phase has changed from <b><u>Implemented</u></b> to <b><u>Closed</u></b>.";
  sActText = "Please take note that this RFC has been <b><u>Closed</u></b>.";
  sActFont = "red";
  oNewType = oaNew.getField("category") ; oNewPhase = oaNew.getField("status") ; oOldPhase = (oaOld==null) ? "" : oaOld.getField("status"); 
  if ( ( oNewType.equals("Normal") || oNewType.equals("Emergency") ) && oNewPhase.equals(STATUS_CLOSED) && !oNewPhase.equals(oOldPhase) ) {
    bAdded = false; 
    aField = ["cnw-originator-account","cnw-initiated-by-account"];
    for( i=0 ; i<aField.length ; i++ ) {
      sData = oaNew.getField(aField[i]) ; logger.info(" - adding "+aField[i]+" to notification -> " + sData) ; oaNotify.addUser(sData) ; bAdded = true; 
    }
    sField = "cnw-change-owner-account" ; sName = oaNew.getField("contact-person") ; sData = oaNew.getField(sField); 
    if ( isNotBlank(sData) ) {
      logger.info(" - adding "+sField+" to notification -> " + sData) ; oaNotify.addUser(sData) ; bAdded = true;
      sTitle   = "Change Owner" ; sTFill   = sName;
      sActText = "As the <b>"+sTitle+"</b> ("+sTFill+"), please take note that this RFC has been <b><u>Closed</u></b>.";
    }
    if (bAdded) {
      oaNotify.setMessage( msgCreate(sEvtText,sActText,sActFont) );
      logger.info(sLog+" ### notifyNewToScheduled Exit true ###");
      return true;
    }
    logger.info(" # ERROR # cnw-change-owner-account is null -> Cancelling implemented to closed notification!");
  }
  logger.info(sLog + " ### notifyImplementedToClosed Exit false ###");
  return false;
}

function notifyTypeChanged(oaOld,oaNew,oaNotify) {
//-----------------------------------------------------------------------------
// Notification for RFC Type Changes
//-----------------------------------------------------------------------------
  sLog = oaNew.getField("request-id");
  logger.info(sLog + " ### notifyTypeChanged Entry ###");
  oNewType  = oaNew.getField("category") ; oOldType  = (oaOld==null) ? "" : oaOld.getField("category"); 
  sEvtText  =  "The RFC type has changed from <b><u>"+oOldType+"</u></b> to <b><u>"+oNewType+"</u></b>.";
  sActText  =  "Please take note that this change has occurred, as it may impact on your planning.";
  sActFont  =  "red";
  if ( !oNewType.equals("Unplanned") && !oNewType.equals(oOldType) ) {
    bAdded = false; 
    aField = ["cnw-initiated-by-account"];
    for( i=0 ; i<aField.length ; i++ ) {
      sData = oaNew.getField(aField[i]) ; logger.info(" - adding "+aField[i]+" to notification -> " + sData) ; oaNotify.addUser(sData) ; bAdded = true; 
    }
    sField = "cnw-change-owner-account" ; sName = oaNew.getField("contact-person") ; sData = oaNew.getField(sField); 
    if ( isNotBlank(sData) ) {
      logger.info(" - adding "+sField+" to notification -> " + sData) ; oaNotify.addUser(sData) ; bAdded = true;
      sTitle   = "Change Owner" ; sTFill = sName;
      sActText = "As the <b>"+sTitle+"</b> ("+sTFill+"), please take note that this change has occurred, as it may impact on your planning.";
    }
    if (bAdded) {
      oaNotify.setMessage( msgCreate(sEvtText,sActText,sActFont) );
      logger.info(sLog+" ### notifyNewToScheduled Exit true ###");
      return true;
    }
    logger.info(" # ERROR # cnw-change-owner-account is null -> Cancelling type changed notification!");
  }
  logger.info(sLog + " ### notifyTypeChanged Exit false ###");
  return false;
}

function notifyAssignmentChanged(oaOld,oaNew,oaNotify) {
//-----------------------------------------------------------------------------
// Notification for Assignment Changes
//-----------------------------------------------------------------------------
  sLog = oaNew.getField("request-id");
  logger.info(sLog + " ### notifyAssignmentChanged Entry ###");
  oNewAT = oaNew.getField("cnw-assigned-to") ; oOldAT  = (oaOld==null) ? "" : oaOld.getField("cnw-assigned-to"); 
  if ( !oNewPhase.equals(STATUS_CLOSED) && oNewPhase.equals(oOldPhase) && ( ( isNotBlank(oNewAT) || isNotBlank(oOldAT) ) && !oNewAT.equals(oOldAT) ) ) {
    bAdded = false;
    sField = "cnw-assigned-to-account" ; sName = oaNew.getField("cnw-assigned-to") ; sData = oaNew.getField(sField); 
    if ( isNotBlank(sData) ) {
      logger.info(" - adding "+sField+" to notification -> " + sData) ; oaNotify.addUser(sData) ; bAdded = true;
      sTitle    = "Assigned To" ; sTFill = sName;
      sActText  =  "As the <b>"+sTitle+"</b> ("+sTFill+"), please take note of the assignment change and check if <b>you have a task to complete</b>.";
    } else {
      logger.info(" # ERROR # new "+sField+" is null");
      sActText  =  "As the previous <b>Assigned To</b> person, please take note of the assignment change</b>.";
    }
    sField = "cnw-assigned-to-account" ; sName = oaOld.getField("cnw-assigned-to") ; sData = oaOld.getField(sField); 
    if ( isNotBlank(sData) ) {
      logger.info(" - adding "+sField+" to notification -> " + sData) ; oaNotify.addUser(sData) ; bAdded = true;
    } else {
      logger.info(" # ERROR # previous "+sField+" is null");
    }
    if (bAdded) {
      sOldAssigned = (isNotBlank(oOldAT)) ? oOldAT : "BLANK" ; sNewAssigned = (isNotBlank(oNewAT)) ? oNewAT : "BLANK";
      sEvtText  =  "The RFC has had the <b>Assigned To</b> changed from <b><u>"+sOldAssigned+"</u></b> to <b><u>"+sNewAssigned+"</u></b>.";
      sActFont  =  "red";
      oaNotify.setMessage( msgCreate(sEvtText,sActText,sActFont) );
      logger.info(sLog+" ### notifyNewToScheduled Exit true ###");
      return true;
    }
    logger.info(" # ERROR # cnw-assigned-to-account is null -> Cancelling assignment changed notification!");
  }
  logger.info(sLog + " ### notifyAssignmentChanged Exit false ###");
  return false;
}

function notifyPlannedOverdue(oaOld,oaNew,oaNotify) {
//-----------------------------------------------------------------------------
// Notification for Planned Overdue
//-----------------------------------------------------------------------------
  var sLog=oaNew.getField("request-id");logger.info(sLog + " ### notifyPlannedOverdue Entry ###");
  var sField;var sName;var sData;var sTitle;var sTFill;var sEvtText;var sActText;var sActFont;
  var nGD=3;var oNewType=oaNew.getField("category");var oNewPhase=oaNew.getField("status");var oNewNofify=oaNew.getField("cnw-planned-overdue");
  var oNewDays=oaNew.getField("cnw-planned-days");var oOldDays=(oaOld==null)?"0":oaOld.getField("cnw-planned-days");
  if ( !oNewType.equals("Unplanned") && !oNewPhase.equals(STATUS_CLOSED) && oNewNofify.equals("Yes") && oNewDays>nGD && !oNewDays.equals(oOldDays) ) {
    sField = "cnw-change-owner-account" ; sName = oaNew.getField("contact-person") ; sData = oaNew.getField(sField);    
    if ( isNotBlank(sData) ) {
      logger.info(" - adding "+sField+" to notification -> " + sData) ; oaNotify.addUser(sData);
      sTitle="Change Owner";sTFill=sName;
      sEvtText  =  "The RFC's <b>Planned Date</b> is Overdue by "+oNewDays+" days.";
      sActText  =  "As the <b>"+sTitle+"</b> ("+sTFill+"), please close, cancel, or reschedule the RFC.";
      sActFont  =  "red";
      oaNotify.setMessage( msgCreate(sEvtText,sActText,sActFont) );
      logger.info(sLog+" ### notifyPlannedOverdue Exit true ###");
      return true;
    }
    logger.info(" # ERROR # cnw-change-owner-account is null -> Cancelling Planned Overdue notification!");
  }
  logger.info(sLog + " ### notifyPlannedOverdue Exit false ###");
  return false;
}

function shouldCalcTimePeriods(oaOld,oaNew) {
//-----------------------------------------------------------------------------
// Check for Should Calc Time Periods
// Always Returns true
//-----------------------------------------------------------------------------
  return true;
}

function shouldCalcSimilar(oaOld,oaNew) {
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

function allTrim(saArg) {
//-----------------------------------------------------------------------------
// Removes leading and ending whitespaces
//-----------------------------------------------------------------------------
  return lTrim(rTrim(saArg));
}

function dOut(oaDate) {
//-----------------------------------------------------------------------------
// Formats Date Object to a readable string
//-----------------------------------------------------------------------------
  Date.prototype.getDayName   = function() {return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][this.getDay()];}
  Date.prototype.getMonthName = function() {return ['January','February','March','April','May','June','July','August','September','October','November','December'][this.getMonth()];}
  dDate     = new Date(parseInt(oaDate)); 
  nTZH      = dDate.getTimezoneOffset() / 60 ;
  sTZN      = (nTZH == 8) ? "PST" : "PDT";
  sAorP     = (dDate.getHours()<12) ? "AM" : "PM";
  sHours    = dDate.getHours()   ; sHours   = (sHours   < 10) ? "0"+sHours   : sHours;
  sMinutes  = dDate.getMinutes() ; sMinutes = (sMinutes < 10) ? "0"+sMinutes : sMinutes;
  sSeconds  = dDate.getSeconds() ; sSeconds = (sSeconds < 10) ? "0"+sSeconds : sSeconds;
  sReturn   = dDate.getDayName()+", ";
  sReturn  += dDate.getMonthName()+" "+dDate.getDate()+", "+dDate.getFullYear()+", ";
  sReturn  += sHours+":"+sMinutes+":"+sSeconds+" "+sAorP+" ("+sTZN+")";
  bLogIt = false;if(bLogIt) {logger.info(" - nTZH    -> "+nTZH);logger.info(" - sTZN    -> "+sTZN);logger.info(" - sAorP   -> "+sAorP);logger.info(" - oaDate   -> "+oaDate);logger.info(" - sHours   -> "+sHours);logger.info(" - sMinutes -> "+sMinutes);logger.info(" - sSeconds   -> "+sSeconds);logger.info(" - dDate   -> "+dDate);logger.info(" - sReturn -> "+sReturn);}
  return sReturn;
}

function isLongerThan(oaRFC,naTime) {
//-----------------------------------------------------------------------------
// Compares varible against a time
//-----------------------------------------------------------------------------
  if ( (oaRFC.getField("planned-end-time") - oaRFC.getField("planned-start-time")) > naTime ) {return true;}
  return false;
}

function isNotBlank(oaArg) {
//-----------------------------------------------------------------------------
// Checks for non-blankness of a variable
//-----------------------------------------------------------------------------
  if ( oaArg.equals(null) ) {return false;}
  if ( oaArg.equals("")   ) {return false;}
  return true;
}

function isStatusValid4Calc(oaRFC) {
//-----------------------------------------------------------------------------
// Validates Status for Calc
//-----------------------------------------------------------------------------
  if (oaRFC!=null) {
    sStatus = oaRFC.getField("status");
    return sStatus==STATUS_PENDING_APPROVAL || sStatus==STATUS_CLOSED || sStatus==STATUS_OPEN || sStatus==STATUS_SCHEDULED || sStatus==STATUS_IMPLEMENTED || sStatus==STATUS_PENDING_ACCEPTANCE;
  }
  return false;
}

function lTrim(saArg) {
//-----------------------------------------------------------------------------
// Removes leading whitespaces
//-----------------------------------------------------------------------------
  var re = /\s*((\S+\s*)*)/;
  return saArg.replaceAll(re, "$1");
}

function msgCreate(saEvtText,saActText,saActFont,saEvtTable) {
//-----------------------------------------------------------------------------
// Formats Date Object to a readable string
//-----------------------------------------------------------------------------
  if(saActFont==null)  {saActFont="" ;}
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

function rTrim(saArg) {
//-----------------------------------------------------------------------------
// Removes ending whitespaces
//-----------------------------------------------------------------------------
  var re = /((\s*\S+)*)\s*/;
  return saArg.replaceAll(re, "$1");
}
