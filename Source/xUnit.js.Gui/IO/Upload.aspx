<%@ Page Language="C#" %>
<%   
	Response.ClearHeaders();
	Response.AddHeader("Content-Type","text/plain");
   
	int length = 0;
	for (int i = 0; i < Request.Files.Count; i++) length += Request.Files[i].ContentLength;
	Response.AddHeader("Content-Length", length.ToString());

	for (int i = 0; i < Request.Files.Count; i++)
	{
		byte[] buffer = new byte[Request.Files[i].ContentLength];
		Request.Files[i].InputStream.Read(buffer, 0, buffer.Length);
		Response.BinaryWrite(buffer);
		Response.Flush();
	}
	Response.End();
%>