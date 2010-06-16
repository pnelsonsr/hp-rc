<META http-equiv=Content-Type content="text/html; charset=UTF-8">
<#setting time_zone="PST">
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<!--
================================================================================
 name      :  mailbody-html.flt
 version   :  0.1.3
 revision  :  2010-158
================================================================================
-->
<html>
<head>
<title>Message</title>


<style>
td {
	font-weight: normal;
	font-size: 12px;
	color: rgb(0, 0, 0);
	font-family: Verdana, Arial, Helvetica, sans-serif;
}

body {
	padding: 10px;
	color: rgb(0, 0, 0);
	font-weight: normal;
	font-size: 12px;
	font-family: Verdana, Arial, Helvetica, sans-serif;
	background-color: white;
}

table {
	font-weight: normal;
	font-size: 12px;
	color: rgb(0, 0, 0);
	font-family: Verdana, Arial, Helvetica, sans-serif;
	volume: 50;
}

.product {
	border-style: solid solid none;
	border-color: rgb(148, 142, 140) rgb(148, 142, 140) rgb(41, 63, 111);
	border-width: 5px 5px medium;
	padding: 5px 10px;
	color: white;
	font-size: 24px;
	font-family: Arial, Helvetica, Geneva, Swiss, SunSans-Regular;
	background-color: rgb(0, 51, 102);
}

.rest {
	border-left: 5px solid rgb(148, 142, 140);
	border-right: 5px solid rgb(148, 142, 140);
	border-bottom: 5px solid rgb(148, 142, 140);
	padding: 5px 10px 10px;
	color: white;
	font-size: 24px;
	font-family: Arial, Helvetica, Geneva, Swiss, SunSans-Regular;
	background-color: white;
}

.name {
	border-right: medium none rgb(222, 215, 214);
	border-bottom: 2px solid rgb(222, 215, 214);
	font-weight: bold;
	font-size: 13px;
	width: 80%;
	height: 22px;
}

.chl {
	border-bottom: 1px solid white;
	font-weight: bold;
	font-size: 10px;
	padding-right: 5px;
	padding-left: 5px;
	width: 17%;
	height: 20px;
	background-color: rgb(239, 235, 231);
}

.defno {
	border-bottom: 1px solid white;
	font-weight: bold;
	font-size: 12px;
	padding-right: 5px;
	padding-left: 5px;
	width: 17%;
}

.ctext {
	border-bottom: 1px solid rgb(239, 235, 231);
	font-size: 11px;
	padding-right: 5px;
	padding-left: 5px;
	width: 80%;
	height: 20px;
}

.ctable {
	border-bottom: 1px solid rgb(197, 190, 189);
	font-size: 11px;
	padding-right: 5px;
	padding-left: 5px;
	height: 20px;
}

.hl {
	border-bottom: 2px dotted rgb(222, 215, 214);
	color: rgb(114, 78, 109);
	font-weight: bold;
	font-size: 12px;
	background-color: white;
	height: 20px;
}

.hl_no_border {
	color: rgb(114, 78, 109);
	width: 17%;
	font-weight: bold;
	font-size: 12px;
	background-color: white;
	height: 20px;
}

.space {
	height: 10px;
}

.descr {
	padding: 1px;
	font-size: 11px;
}

.smallLink {
	font-size: 9px;
}
</style>
</head>


<body leftmargin="0" topmargin="0" marginheight="0" marginwidth="0">

<table border="0" cellpadding="0" cellspacing="0" width="100%">

	<tbody>

		<tr>

			<td class="product">Change Event Notification</td>

		</tr>

		<tr>

			<td class="rest">

			<table class="textfont" align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
	            <tbody>
	              <tr>
	                <!--  <td 
	                	<#if request.hasParent()> class="hl_no_border" </#if><#if !request.hasParent()>class="hl"</#if> 
	                	title="Go To Request">Request:</td>
	                	<td <#if !request.hasParent()>class="hl"</#if>><a href="${request.serverAddress}/index.html?requestOrigin=ONYX&requestedChangeID=${request.getField("internal-id")?string(0)}">${request.getField("request-id")}</a></td>
	              		--> 
	              	<td></td>
	              </tr>
	            </tbody>
      	    </table>
			<table class="space" border="0" cellpadding="0" cellspacing="0"
				width="100%">
				<tbody>
					<tr>
						<td></td>
					</tr>
				</tbody>
			</table>

			<#if request.hasParent()>

			<table class="textfont" align="center" border="0" cellpadding="0"
				cellspacing="0" width="100%">
				<tbody>
					<tr>
						<td class="hl">
						<table class="textfont" align="center" border="0" cellpadding="0"
							cellspacing="0" width="100%">
							<tbody>
								<tr>
									<td class="hl_no_border"></td>
									<td align="left">The request is a task of change <a
										href="${request.serverAddress}/index.html?requestOrigin=ONYX&requestedChangeID=${request.getRootRFC().getField("internal-id")?string(0)}">${request.getRootRFC().getField("request-id")}</a>
									<a class="smallLink" href="#parentDetails"> more...</a></td>
								</tr>
							</tbody>
						</table>
						</td>
					</tr>
					<tr>
						<th class="space" align="left"></th>
					</tr>
				</tbody>
			</table>

			<#elseif request.getFieldLabel("ticket-level") == "Task">
			<table class="textfont" align="center" border="0" cellpadding="0"
				cellspacing="0" width="100%">
				<tbody>
					<tr>
						<td class="hl">
						<table class="textfont" align="center" border="0" cellpadding="0"
							cellspacing="0" width="100%">
							<tbody>
								<tr>
									<td class="hl_no_border"></td>
									<td align="left">The request is a task with no parent request</td>
								</tr>
							</tbody>
						</table>
						</td>
					</tr>
					<tr>
						<th class="space" align="left"></th>
					</tr>
				</tbody>
			</table> 
			</#if>
			
			<p>
			<table class="textfont" align="center" border="0" cellpadding="0"
				cellspacing="0" width="100%">

				<tbody>
					<tr>

						<th class="hl" align="left">${request.getField("summary")}</th>

					</tr>

					<tr>

						<th class="space" align="left"></th>

					</tr>

				</tbody>
			</table>

			<table class="textfont" align="center" border="0" cellpadding="0"
				cellspacing="0" width="100%">

				<tbody>

					<tr>
						<td><b>RFC:</b> <a href="${request.serverAddress}/index.html?requestOrigin=ONYX&requestedChangeID=${request.getField("internal-id")?string(0)}">${request.getField("request-id")}</a></td>
					</tr>
					
					<tr>
						<td>&nbsp;</td>
					</tr>
					
					<tr>
						<td><b>Type:</b> ${request.getField("category")}</td>
					</tr>

					<tr>

					<td>
			<#if notificationRuleSummary != "">
			<table class="textfont" align="center" border="0" cellpadding="0"
				cellspacing="0" width="100%">
				<tbody>
					
					<tr>
						<td class="descr">
							${(notificationRuleSummary)?replace("\r","<br>")}
						</td>
					</tr>
				</tbody>
			</table>
			</#if>
					</td>
					</tr>
				</tbody>
			</table>

			<table class="space" border="0" cellpadding="0" cellspacing="0"
				width="100%">

				<tbody>

					<tr>

						<td>&nbsp;</td>

					</tr>

				</tbody>
			</table>

			<table class="textfont" align="center" border="0" cellpadding="0"
				cellspacing="0" width="100%">

				<tbody>

					<tr>

						<th class="hl" align="left">RFC ${fieldsLabels.get("description")}</th>

					</tr>

					<tr>

						<th class="space" align="left"></th>

					</tr>

				</tbody>
			</table>

			<table class="textfont" align="center" border="0" cellpadding="0"
				cellspacing="0" width="100%">

				<tbody>

					<tr>

						<td class="descr">${(request.getField("description","No Description Available")?html)?replace("\r","<br>")}</td>

					</tr>
					<tr>
						<td></td>
					</tr>

				</tbody>
			</table>

			<table class="space" border="0" cellpadding="0" cellspacing="0"
				width="100%">

				<tbody>

					<tr>

						<td>&nbsp;</td>

					</tr>

				</tbody>
			</table>

<table class="textfont" align="center" border="0" cellpadding="0"
				cellspacing="0" width="100%">

				<tbody>

					<tr>

						<th class="hl" align="left">RFC ${fieldsLabels.get("cnw-justifcation")}</th>

					</tr>

					<tr>

						<th class="space" align="left"></th>

					</tr>

				</tbody>
			</table>

			<table class="textfont" align="center" border="0" cellpadding="0"
				cellspacing="0" width="100%">

				<tbody>

					<tr>

						<td class="descr">${(request.getField("cnw-justifcation","No Justification Available")?html)?replace("\r","<br>")}</td>

					</tr>
					<tr>
						<td>&nbsp;</td>
					</tr>

				</tbody>
			</table>

			<table class="space" border="0" cellpadding="0" cellspacing="0"
				width="100%">

				<tbody>

					<tr>

						<td></td>

					</tr>

				</tbody>
			</table>

			<table class="textfont" align="center" border="0" cellpadding="0"
				cellspacing="0" width="100%">

				<tbody>

					<tr>

						<th class="hl" align="left">Changed CIs</th>

					</tr>

					<tr>

						<th class="space" align="left"></th>

					</tr>

				</tbody>
			</table>
			<table class="textfont" align="center" border="0" cellpadding="0"
				cellspacing="0" width="100%">

				<tbody>


						<tr>
	
							<td class="chl">${(request.getField("changed-ci-list")?html)?replace("\r","<br>
						")}</td>
	
						</tr>
			

				</tbody>
			</table>


			<table class="space" border="0" cellpadding="0" cellspacing="0"
				width="100%">

				<tbody>

					<tr>

						<td>&nbsp;</td>

					</tr>

				</tbody>
			</table>



			<table class="textfont" align="center" border="0" cellpadding="0"
				cellspacing="0" width="100%">

				<tbody>

					<tr>

						<th class="hl" align="left">Affected Business CIs</th>

					</tr>

					<tr>

						<th class="space" align="left"></th>

					</tr>

				</tbody>
			</table>
			<#if (affectedViews.size() > 0)>
			<table class="textfont" align="center" border="0" cellpadding="0"
				cellspacing="0" width="100%">

				<tbody>

					<tr>

						<th class="descr" align="left">
						${getMSG("business.ci.label.capital")}</th>

						<th class="descr" align="left">Severity</th>

					</tr>
					<#list affectedViews as viewInfo>


					<tr>

						<td class="chl">${viewInfo.viewName} <#if viewInfo.removed>
						(obsolete) </#if></td>

						<td style="color: " rgb<#if (viewInfo.severity.value >
						2)>(230, 0, 0)</#if> <#if (viewInfo.severity.value = 2)>(206, 162,
						5)</#if> <#if (viewInfo.severity.value < 2)>(0, 153, 0)</#if> ;"
						class="ctext"> ${viewInfo.getSeverityLabel()}</td>

					</tr>
					</#list>

				</tbody>
			</table>
			</#if>
			</p>
			<p>
			<table class="textfont" align="center" border="0" cellpadding="0"
				cellspacing="0" width="100%">

				<tbody>

					<tr>

						<th class="hl" align="left">RFC Details</th>

					</tr>

					<tr>

						<th class="space" align="left"></th>

					</tr>

				</tbody>
			</table>

			<table class="textfont" align="center" border="0" cellpadding="0"
				cellspacing="0" width="100%">

				<tbody>

					<tr>

						<td class="chl" width="25%"><b>${fieldsLabels.get("creating-service-desk")}</b></td>

						<td class="ctext">${request.getField("creating-service-desk","No
						Service Desk Name Available")}</td>

					</tr>

					<tr>

						<td class="chl" width="25%"><b>${fieldsLabels.get("status")}</b></td>

						<td class="ctext">${request.getFieldLabel("status")}</td>

					</tr>

					<tr>

						<td class="chl" width="25%"><b>${fieldsLabels.get("calculated-risk")}</b></td>

						<td class="ctext">${request.getField("calculated-risk")}</td>

					</tr>

					<tr>

						<td class="chl" width="25%"><b>${fieldsLabels.get("collision-severity")}</b></td>

						<td class="ctext">${request.getFieldLabel("collision-severity")}</td>

					</tr>

					<tr>

						<td class="chl" width="25%"><a
							href="mailto:${request.getField(" contact-email","No EmailAvailable")}">${fieldsLabels.get("contact-person")}</a></td>

						<td class="ctext">${request.getField("contact-person","No
						Contact Person Available")}</td>

					</tr>

					<tr>

						<td class="chl" width="25%"><b>${fieldsLabels.get("impact-severity")}</b></td>

						<td class="ctext">
						${request.getFieldLabel("impact-severity")}</td>

					</tr>

					<tr>

						<td class="chl" width="25%"><b>${fieldsLabels.get("priority")}</b></td>

						<td class="ctext">${request.getFieldLabel("priority")}</td>

					</tr>

					<tr>

						<td class="chl" width="25%"><b>${fieldsLabels.get("is-abnormal")}</b></td>

						<td class="ctext">${request.getField("is-abnormal")?string("Yes",
						"No")}</td>

					</tr>

					<tr>

						<td class="chl" width="25%"><b>${fieldsLabels.get("creation-time")}</b></td>

						<td class="ctext"><#if (request.getField("creation-time") >
						0)>${createDate(request.getField("creation-time"))?string("EEEE, MMMM dd, yyyy, hh:mm:ss a '('zzz')'")}</#if></td>

					</tr>

					<tr>

						<td class="chl" width="25%"><b>${fieldsLabels.get("last-update-time")}</b></td>

						<td class="ctext"><#if (request.getField("last-update-time")
						>
						0)>${createDate(request.getField("last-update-time"))?string("EEEE, MMMM dd, yyyy, hh:mm:ss a '('zzz')'")}</#if></td>

					</tr>

					<tr>

						<td class="chl" width="25%"><b>${fieldsLabels.get("planned-start-time")}</b></td>

						<td class="ctext"><#if
						(request.getField("planned-start-time") >
						0)>${createDate(request.getField("planned-start-time"))?string("EEEE, MMMM dd, yyyy, hh:mm:ss a '('zzz')'")}</#if></td>

					</tr>



					<tr>

						<td class="chl" width="25%"><b>${fieldsLabels.get("planned-end-time")}</b></td>

						<td class="ctext"><#if (request.getField("planned-end-time")
						>
						0)>${createDate(request.getField("planned-end-time"))?string("EEEE, MMMM dd, yyyy, hh:mm:ss a '('zzz')'")}</#if></td>

					</tr>

					<tr>

						<td class="chl" width="25%"><b>${fieldsLabels.get("actual-start-time")}</b></td>

						<td class="ctext"><#if (request.getField("actual-start-time")
						>
						0)>${createDate(request.getField("actual-start-time"))?string("EEEE, MMMM dd, yyyy, hh:mm:ss a '('zzz')'")}<#else>${getMSG("GenericRFCImpl.notApplicable")}</#if></td>

					</tr>



					<tr>

						<td class="chl" width="25%"><b>${fieldsLabels.get("actual-end-time")}</b></td>

						<td class="ctext"><#if (request.getField("actual-end-time") >
						0)>${createDate(request.getField("actual-end-time"))?string("EEEE, MMMM dd, yyyy, hh:mm:ss a '('zzz')'")}<#else>${getMSG("GenericRFCImpl.notApplicable")}</#if></td>

					</tr>
					<tr>

						<td class="chl" width="25%"><b>Number of Discussion
						Threads</b></td>

						<td class="ctext">${request.getCommentCount()}</td>

					</tr>

					<tr>

					</tr>

					<tr>

						<td class="chl" width="25%"><b>${fieldsLabels.get("request-id")}</b></td>

						<td class="ctext">${request.getField("request-id")}</td>

					</tr>

				</tbody>
			</table>

			</p>

			</td>

			<br>

		</tr>

	</tbody>
</table>

 
<#if request.hasParent()>
<tr>
	<td class="rest">

	<table class="textfont" align="center" border="0" cellpadding="0"
		cellspacing="0" width="100%">
		<tbody>
			<tr>
				<th class="hl" align="left"><a name="parentDetails"></a>Related
				Change Summary</th>
			</tr>
			<tr>
				<th class="space" align="left"></th>
			</tr>
		</tbody>
	</table>

	<table class="textfont" align="center" border="0" cellpadding="0"
		cellspacing="0" width="100%">
		<tbody>
			<tr>
				<td class="descr">${(request.getRootRFC().getField("summary")?html)?replace("\r","<br>
				")}</td>
			</tr>
			<tr>
				<th class="space" align="left"></th>
			</tr>
		</tbody>
	</table>

	<table class="textfont" align="center" border="0" cellpadding="0"
		cellspacing="0" width="100%">
		<tbody>
			<tr>
				<th class="hl" align="left">Related Change Description</th>
			</tr>
			<tr>
				<th class="space" align="left"></th>
			</tr>
		</tbody>
	</table>

	<table class="textfont" align="center" border="0" cellpadding="0"
		cellspacing="0" width="100%">
		<tbody>
			<tr>
				<td class="descr">${(request.getRootRFC().getField("description","No
				Description Available")?html)?replace("\r","<br>
				")}</td>
			</tr>
		</tbody>
	</table>
	</td>
</tr>
</#if>

</body>
</html>
