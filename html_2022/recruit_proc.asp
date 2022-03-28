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
	Dim Product, Company, Tel, Email, Site, RelSite1, RelSite2, Budget, Subject, Content, RegName, AttrFile
	Dim tmpSeq
	Dim Result
	
	Const FilePath = "\recruit\"

	Call Main()
	
	Sub Main()
		Call getParamObj()
		Call setProc()
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

		' ## File upload
		tmpFile = FN_FileUpload(FilePath, "file", False, False)
		
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
			.CommandText ="uspRecruit_Proc"
			.Parameters.Refresh
			.Parameters("@Flag").Value 		= "ADD"
			.Parameters("@Seq").Value 		= 0
			
			.Parameters("@Product").Value 	= Product
			.Parameters("@Company").Value 	= Company
			.Parameters("@Tel").Value 		= Tel
			.Parameters("@Email").Value 	= Email
			.Parameters("@Site").Value 		= Site
			.Parameters("@RelSite1").Value 	= RelSite1
			.Parameters("@RelSite2").Value 	= RelSite2
			.Parameters("@Budget").Value 	= Budget
			.Parameters("@Subject").Value 	= Subject
			.Parameters("@Content").Value 	= Content
			.Parameters("@AttrFile").Value 	= AttrFile
			.Parameters("@RegName").Value 	= RegName

			.Execute
			
			Result = .Parameters("@Result")
		End With
		
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
