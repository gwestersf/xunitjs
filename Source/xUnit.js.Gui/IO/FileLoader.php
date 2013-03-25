<?php 
  $method=isset($_SERVER['REQUEST_METHOD'])?$_SERVER['REQUEST_METHOD']:'';
  $path=isset($_REQUEST['path'])?$_REQUEST['path']:'';
  $type=isset($_REQUEST['type'])?$_REQUEST['type']:'';
  $output='';

  if($method=="HEAD"){
	if(($type=="directory"&&!is_dir($path))||($type=='file'&&!file_exists($path))){
	  header('X-PHP-Response-Code: 404', true, 404);
	}
  }else if($method=="GET"){
	if($type=="file"){
	  if(file_exists($path))$output=file_get_contents($path);
	  else header('X-PHP-Response-Code: 404', true, 404);
	}else if(is_dir($path)){
	  if($type=="files"||$type=="directories"){
		$directory = new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS);
		$items = new RecursiveIteratorIterator($directory,RecursiveIteratorIterator::SELF_FIRST);
		$items->setMaxDepth(1);
		$found=false;
		foreach ($items as $file) {
			if(($type=="directories"&&$file->isDir())||($type=='files'&&$file->isFile())){
			  if($found===true)echo('\n');
			  echo($file->getFilename());
			  $found=true;
			}else $found=false;
		}
	  }else header('X-PHP-Response-Code: 404', true, 404);
	}else header('X-PHP-Response-Code: 404', true, 404);
  }else header('X-PHP-Response-Code: 500', true, 500);
  header('Content-Type: text/plain');
  echo $output;
?>