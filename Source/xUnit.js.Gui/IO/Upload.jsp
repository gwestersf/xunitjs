<%@ page import="java.io.FileInputStream" %>
<%   
	String fileName=request.getParameter("FileInput");
	FileInputStream stream=new FileInputStream(fileName);
	response.addHeader("Content-Type", "text/plain");
	boolean found=false;

	int character;
	while((character=stream.read())>-1){
		if(!found)found=true;
		out.print((char)character);
	}
	stream.close();

	if(!found)response.setStatus(404);
%>