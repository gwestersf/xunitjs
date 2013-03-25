@ECHO OFF
SetLocal EnableDelayedExpansion

REM Process Input Parameters
	SET ProjectDir=%1
	SET TargetDir=%2
	SET TargetName=%3
	SET TargetDll=%4
	SET ConfigName=%5
	SET DllOrder=%6

	CALL :trimQuotes ProjectDir
	CALL :trimQuotes TargetDir
	CALL :trimQuotes TargetName
	CALL :trimQuotes TargetDll
	CALL :trimQuotes ConfigName
	CALL :trimQuotes DllOrder

REM Create empty file to track processed assemblies
	SET ProcessedList="%TargetDir%_ProcessedAssemblies.txt"
	IF EXIST %ProcessedList% DEL %ProcessedList%
	TYPE NUL > %ProcessedList%

REM Create empty target file
	SET TargetFile=%TargetDir%%TargetName%.js
	CALL :trimExtension TargetFile

	ECHO.
	ECHO Building "%TargetFile%"
	TYPE NUL > "%TargetFile%"
	ECHO.

REM Add License Text
	REM CALL :addLicense

REM Process assemblies specified in order
	IF NOT "%DllOrder%"=="" (
		ECHO.
		CALL :orderedassemblies
	)
	
REM Process remaining assemblies in target directory
	FOR /R "%TargetDir%" %%F IN (*.dll) DO CALL :checkassembly "%%F"

REM Process script files in project directory
	ECHO.
	ECHO // %TargetName% >> "%TargetFile%"
	FOR /R "%ProjectDir%" %%F IN (*.js) DO CALL :checkfile "%%F"
	ECHO.

GOTO :end



REM -------------------------
REM SubRoutine Declarations |
REM -------------------------

:addLicense
	IF EXIST "%~dp0License.txt" (
		ECHO Adding License
		PUSHD "%~dp0"
		FOR /F "delims=" %%L IN (License.txt) DO ECHO // %%L >> "%TargetFile%"
		ECHO. >> "%TargetFile%"
		POPD
	)
GOTO :EOF

:orderedassemblies
	IF "%DllOrder%" == "" GOTO :EOF
	FOR %%F IN (%DllOrder%) DO CALL :orderedassembly "%TargetDir%%%F.dll"
GOTO :EOF

:orderedassembly
	SET assembly="%1"
	CALL :trimQuotes assembly
	IF NOT EXIST "%assembly%" (
		ECHO UNABLE TO FIND ORDERED ASSEMBLY %assembly%
		EXIT -1
		GOTO :EOF
	)
	ECHO Preloading: %assembly%
	CALL :checkassembly "%assembly%"
GOTO :EOF

:checkassembly
	PUSHD "%TargetDir%"
	
	REM Skip Project Output
	IF %1=="%TargetDll%" GOTO :EOF
		
	REM Check Processed Files for Dupe
	SET Processed=FALSE
	FOR /F "delims=" %%P IN (_ProcessedAssemblies.txt) DO CALL :checkprocessed %%P %1
	IF %Processed%==TRUE GOTO :EOF
	
	SET RefreshFile=
	FOR /f "tokens=*" %%F in ('TYPE %1.refresh 2^>NUL') DO SET RefreshFile="%%F"
	IF EXIST "%RefreshFile%" ( 
		ECHO Updating Assembly %1 
		COPY /Y "%RefreshFile%" %1
	)
	CALL :extract %1
	ECHO %1 >> %ProcessedList%
	POPD
GOTO :EOF

:checkprocessed
	IF %1==%2 SET Processed=TRUE
GOTO :EOF

:extract
	SET Resource="%~n1.bin.%ConfigName%.%~n1.js"
	CALL :trimExtension Resource
	ECHO Extracting %Resource%
	ECHO	   From %1
	"%~dp0ConsoleCommand.exe" Extract /Assembly=%1 /Resource=%Resource% > _TempResource.txt
	IF NOT ERRORLEVEL==0 (
		ECHO.
		ECHO ERROR
		"%~dp0ConsoleCommand.exe" Extract /Assembly=%1 /Resource=%Resource%
		EXIT -1
	)
	TYPE _TempResource.txt >> "%TargetFile%"
	IF EXIST _TempResource.txt DEL _TempResource.txt /F
	REM "%~dp0ConsoleCommand.exe" Extract /Assembly=%1 /Resource=%Resource% >> "%TargetFile%"
GOTO :EOF

:checkfile
	@ECHO "%1" | find /i "\bin" >NUL 2>NUL 
	IF ERRORLEVEL==1 GOTO :append %~1
GOTO :EOF

:append
	IF "%TargetFile%"=="%1" GOTO :EOF
	ECHO Adding %1
	ECHO. >> "%TargetFile%"
	TYPE %1 >> "%TargetFile%"
	ECHO. >> "%TargetFile%"
GOTO :EOF

:trimExtension
	SET string=%1
	CALL SET trimString=%%!string!%%
	SET trimString=%trimString:.js.js=.js%
	SET !string!=!trimString!
	SET string=
	SET trimString=
GOTO :EOF

:trimQuotes
	SET _trimVar=%1
	CALL SET _trimString=%%!_trimVar!%%
	IF [!_trimString:~0^,1!]==[^"] (
		IF [!_trimString:~-1!]==[^"] (
			SET _trimString=!_trimString:~1,-1!
		) ELSE (GOTO :EOF)
	) ELSE (GOTO :EOF)
	SET !_trimVar!=!_trimString!
	IF [!_trimString:~0^,1!]==[^"] (
		IF [!_trimString:~-1!]==[^"] (
			CALL :trimQuotes !_trimVar!
		)ELSE (GOTO :EOF)
	)ELSE (GOTO :EOF)
	SET _trimVar=
	SET _trimString=
GOTO :EOF

:end
	IF EXIST %ProcessedList% DEL %ProcessedList%
	ECHO Done.
GOTO :EOF