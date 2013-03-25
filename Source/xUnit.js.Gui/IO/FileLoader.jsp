<%@ page import="java.io.File" %>
<%@ page import="java.io.FileInputStream" %>
<%   
	String method=request.getMethod().toUpperCase();
	String path=request.getParameter("path");
	String type=request.getParameter("type").toLowerCase();
	String output="";

	File file=new File(path);
	if(!file.exists()){
		response.setStatus(404);
	}else{
		if("HEAD".equals(method)){
			if(("directory".equals(type)&&!file.isDirectory())||("file".equals(type)&&!file.isFile())){
				response.setStatus(404);
			}
		}else if("GET".equals(method)){
			if("file".equals(type)){
				if(file.isFile()){
					FileInputStream stream=new FileInputStream(file);
					StringBuilder fileContents=new StringBuilder();
					int character;
					while((character=stream.read())>-1)fileContents.append((char)character);
					stream.close();
					output=fileContents.toString();
				}else{
					response.setStatus(404);
				}
			}else if(file.isDirectory()){
				if("files".equals(type)||"directories".equals(type)){
					StringBuilder fileList=new StringBuilder();
					File[] files=file.listFiles();
					for(int i=0;i<files.length;i++){
						if(("files".equals(type)&&files[i].isFile())||("directories".equals(type)&&files[i].isDirectory())){
							if(fileList.length()>0)fileList.append("\n");
							fileList.append(files[i].getName());
						}
					}
					output=fileList.toString();
				}else{
					response.setStatus(404);
				}
			}else{
				response.setStatus(404);
			}
		}else{
			response.setStatus(500);
		}
	}
	response.addHeader("Content-Type", "text/plain");
	out.print(output);
%>