// Copyright (c) 2006-2012 John Buchanan 
// This is the file to change for your installation of xUnit.js.Gui:

// Set Form Upload target for file input. 
// This should be a server page or script that is able to read a file input from the request and pipe it back to the response.
xUnit.js.Gui.UploadUri="IO/Upload.php";

// Set File IO Server targets for FileStrategy and DirectoryStrategy access.
System.IO.DirectoryStrategy.Xhr.ResourceUri=System.IO.FileStrategy.Xhr.ResourceUri="IO/FileLoader.php";

// Set Base File Path from which to reference [Import()] statements.
System.IO.Path.SetRoot("");

// Add default file dependencies here

// Import("CriticalFile1");
// Import("SystemFile2");
// ...
// Import("KitchenSinkFileN");
