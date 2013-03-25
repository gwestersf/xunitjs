<?php 
  if($_FILES['FileInput']['error'] == UPLOAD_ERR_OK && is_uploaded_file($_FILES['FileInput']['tmp_name'])) {
	echo file_get_contents($_FILES['FileInput']['tmp_name']);
  }else http_response_code(404);
?>