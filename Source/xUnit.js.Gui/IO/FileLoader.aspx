<%@ Page Language="C#" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Net" %>
<%   
	string path = Request["path"];
	string response = String.Empty;
	switch (Request.HttpMethod) { 
		case "HEAD":
			switch (Request["type"]) {
				case "directory":
					if (!Directory.Exists(path)) Response.StatusCode = (int)HttpStatusCode.NotFound;
					break;
				case "file":
					if (!File.Exists(path)) Response.StatusCode = (int)HttpStatusCode.NotFound;
					break;
			}
			break;
		case "GET":
			switch (Request["type"]) { 
				case "file":
					if (File.Exists(path)) response = File.ReadAllText(path);
					else Response.StatusCode = (int)HttpStatusCode.NotFound;
					break;
				case "files":
					if (Directory.Exists(path)) response = String.Join("\n", Directory.GetFiles(path));
					else Response.StatusCode = (int)HttpStatusCode.NotFound;
					break;
				case "directories":
					if (Directory.Exists(path)) response = String.Join("\n", Directory.GetDirectories(path));
					else Response.StatusCode = (int)HttpStatusCode.NotFound;
					break;
			}
			break;
		default:
			Response.StatusCode = (int)HttpStatusCode.InternalServerError;
			break;
	}
	Response.ClearHeaders();
	Response.AddHeader("Content-Type", "text/plain");
	Response.Write(response);
%>