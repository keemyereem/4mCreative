<!-- #include virtual="/common/include/config.asp" -->
<%
'____________________________________________________________________________________
'
' * Discription : request_proc.asp / 견적요청 처리
' 
' * History : (position number : date / author /회사약칭/ explanation)
'   #000 : 2014-05-20 / 강미현 / 4m / 최초작성
'   #001 : 
'   #002 :
'   #003 :
'____________________________________________________________________________________
%>
<%
	Dim Product, Company, Tel, Email, Site, RelSite1, RelSite2, Budget, Subject, Content, RegName, AttrFile, AttrFile2, AttrFile3
	Dim tmpSeq
	Dim Result
	
	Const FilePath = "\request\"

	Call Main()
	
	Sub Main()
		Call getParamObj()
		Call setProc()
		If Result >= 0 Then
			SendMail()
		End If
		Call setResult()
	End Sub
	
	Sub getParamObj()
	
		Dim fnUploadPath, tmpFile

		fnUploadPath 	= Server.MapPath(GLOBAL_FILE_PATH) & FilePath

		Call SB_FileUpload_Create (fnUploadPath)
		
		Product 	= FN_StrInj(ObjFileUpload("prd"))
		Company = FN_StrInj(ObjFileUpload("coName"))
		Tel 		= FN_StrInj(ObjFileUpload("phNum"))
		Email 	= FN_StrInj(ObjFileUpload("email"))
		Site 		= FN_StrInj(ObjFileUpload("site1"))
		RelSite1 	= FN_StrInj(ObjFileUpload("site2"))
		RelSite2 	= FN_StrInj(ObjFileUpload("site3"))
		Budget 	= FN_StrInj(ObjFileUpload("money"))
		Subject 	= FN_StrInj(ObjFileUpload("title"))
		Content 	= FN_StrInj(ObjFileUpload("cont"))
		RegName = FN_StrInj(ObjFileUpload("userName"))




		' ## File upload_1
		tmpFile = FN_FileUpload(FilePath, "file2", False, False)
		
		If IsArray(tmpFile) Then
			AttrFile = tmpFile(0)
		Else
			AttrFile = tmpFile
		End if
		
		' 파일 체크
		If AttrFile <> "" And Not FN_CheckExt(AttrFile) Then
			SB_FileDel (fnUploadPath&AttrFile)
			Call SB_ReturnErr("업로드 할 수 없는 파일입니다.","BACK")
			Response.end 
		End If
		

		' ## File upload_2
		tmpFile = FN_FileUpload(FilePath, "file3", False, False)
		
		If IsArray(tmpFile) Then
			AttrFile2 = tmpFile(0)
		Else
			AttrFile2 = tmpFile
		End if
		
		' 파일 체크
		If AttrFile2 <> "" And Not FN_CheckExt(AttrFile2) Then
			SB_FileDel (fnUploadPath&AttrFile2)
			Call SB_ReturnErr("업로드 할 수 없는 파일입니다.","BACK")
			Response.end 
		End If
		
		' ## File upload_3
		tmpFile = FN_FileUpload(FilePath, "file4", False, False)
		
		If IsArray(tmpFile) Then
			AttrFile3 = tmpFile(0)
		Else
			AttrFile3 = tmpFile
		End if
		
		' 파일 체크
		If AttrFile3 <> "" And Not FN_CheckExt(AttrFile3) Then
			SB_FileDel (fnUploadPath&AttrFile3)
			Call SB_ReturnErr("업로드 할 수 없는 파일입니다.","BACK")
			Response.end 
		End If
		
		Call SB_FileUpload_Close
		
		If Not IsNumeric(Budget) Then 	Budget = 0
		If Site = "http://"  Then 			Site = ""
		If RelSite1 = "http://"  Then 		RelSite1 = ""
		If RelSite2 = "http://"  Then 		RelSite2 = ""
		
	End Sub
	
	Sub setProc()
		With objCmd
			.ActiveConnection = objDbCon
			.CommandType = 4
			.CommandText ="uspRequest_Proc"
			.Parameters.Refresh
			.Parameters("@Flag").Value 		= "ADD"
			.Parameters("@Seq").Value 		= 0
			
			.Parameters("@Product").Value 	= Product
			.Parameters("@Company").Value 	= Company
			.Parameters("@Tel").Value 		= Tel
			.Parameters("@Email").Value 		= Email
			.Parameters("@Site").Value 		= Site
			.Parameters("@RelSite1").Value 	= RelSite1
			.Parameters("@RelSite2").Value 	= RelSite2
			.Parameters("@Budget").Value 	= Budget
			.Parameters("@Subject").Value 	= Subject
			.Parameters("@Content").Value 	= Content
			.Parameters("@AttrFile").Value 	= AttrFile
			.Parameters("@AttrFile2").Value = AttrFile2
			.Parameters("@AttrFile3").Value = AttrFile3
			.Parameters("@RegName").Value 	= RegName

			.Execute
			
			Result = .Parameters("@Result")
		End With
		
	End Sub

	Sub SendMail()
		Dim fnTo
	
		Const cdoSendUsingMethod = 	"http://schemas.microsoft.com/cdo/configuration/sendusing" 
		Const cdoSendUsingPort = 2 '1 : local 서버 / 2 : 외부 서버
		Const cdoSMTPServer = 	"http://schemas.microsoft.com/cdo/configuration/smtpserver" 
		Const cdoSMTPServerPort = 	"http://schemas.microsoft.com/cdo/configuration/smtpserverport"
		Const cdoSMTPAccountName = 	"http://schemas.microsoft.com/cdo/configuration/smtpaccountname" 
		Const cdoSMTPAuthenticate =	"http://schemas.microsoft.com/cdo/configuration/smtpauthenticate" 
		Const cdoSendUserName =	"http://schemas.microsoft.com/cdo/configuration/sendusername" 
		Const cdoSendPassword = "http://schemas.microsoft.com/cdo/configuration/sendpassword" 
		Const cdoBasic = 1 '1 : cdoBasic (기본인증) / 2 : cdoAnoymous (익명엑세스)
		
		
		Dim objConfig, objMessage,  Fields
		Dim fnRs, MailCount, fnResult

		' ## 메일 수신자 목록 (기획팀 전체)
		With objCmd
			.ActiveConnection = objDBCon
			.CommandType = 4
			.CommandText ="PMS_UserInfo"
			.Parameters.Refresh
			.Parameters("@Flag").Value 			= "REQUEST"
			
			Set fnRs = .Execute
	
			' ## 맴버 목록
			Do While Not fnRs.Eof    '레코드셋에 값이 있으면 계속 반복
				If fnTo <> "" Then	fnTo = fnTo & ","
						
				fnTo = fnTo &  fnRs(0)
				fnRs.moveNext
			Loop
			
			fnRs.Close
			Set fnRs = Nothing		

		End With

		' ## 메일 발송 (수신자가 있을 경우에만 발송)
		If fnTo <> "" Then
			' Get a handle on the config object and it's fields
			Set objConfig = Server.CreateObject("CDO.Configuration") 
			Set Fields = objConfig.Fields 
			
			With Fields 
				.Item(cdoSendUsingMethod) = cdoSendUsingPort 
				.Item(cdoSMTPServerPort) = 25 
				.Item(cdoSMTPAuthenticate) = cdoBasic
	
				.Item(cdoSMTPServer) = "mail.4-m.co.kr"
				.Item(cdoSendUserName) = "web@4-m.co.kr"
				.Item(cdoSendPassword) = "vhdpa1@#"
	
				.Update 
			End With 
			
			Set objMessage = Server.CreateObject("CDO.Message") 
			Set objMessage.Configuration = objConfig 
			
			With objMessage 
				.From =  "web@4-m.co.kr"
				.To = fnTo
				.Subject = "[견적문의] 홈페이지에 새로운 견적문의가 등록되었습니다."
				.HTMLBody = "포엠 홈페이지에 새로운 견적문의가 등록되었습니다.<br>내용은 <a href='http://www.4-m.co.kr/_pms' target='_blank'>PMS</a>에서 확인 바랍니다."
				.BodyPart.Charset="ks_c_5601-1987"		' 설정해주지 않을경우 제목 한글 깨짐
				.HTMLBodyPart.Charset="ks_c_5601-1987"
		
				.Send 
			End With 
			
			Set Fields = Nothing 
			Set objMessage = Nothing
			Set objConfig = Nothing 
		End If
	
			
	End Sub
	
	Sub setResult()
		Dim strMsg, strScript
		
		If Result >= 0 Then
			strMsg = "처리가 완료됐습니다."
			'strScript = "window.location.href = ""request_result.asp?Seq=" & Result & """ "
			strScript = "history.back()"
		Else
			strMsg = "처리도중 오류가 발생했습니다."
			strScript = "history.back()"
		End If
	%>
		<script type="text/javascript">
		<!--
			<% If strMsg <> "" Then %>
			alert("<%=strMsg%>");
			<% End If %>
			<%=strScript%>;
		//-->
		</script>
	<%
	End Sub
%>
