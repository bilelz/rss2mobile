<?php
// Set your return content type



/*$dir = (isset($_GET['dir'])) ? $_GET['dir'] : '';
$category = (isset($_GET['category'])) ? $_GET['category'] : 'mp3';
$url = "http://video.islamedia.free.fr/directory2rss.php?dir=".$dir."&category=".$category; */


/*if(isset($_GET['url'])){
	$url = $_GET['url'];
	if(!strpos($url,'count.json')){ // Si autre que le compteur de twitter, voir js/main.js
		header('Content-type: application/xml; charset=utf-8');
	}
	
	$i = 0;
	foreach($_GET as $cle=>$valeur) 
	{ 
		if($cle!="url"){
			$url = $url.(($i==0)?"?":"&").$cle."=".$valeur;
			$i++;
		}
		
	}
	//echo "url=".$url."\n\n";
*/	
	
	$url = "http://www.al-kanz.org/feed/";
	
	// Get that website's content
	$handle = fopen($url, "r");

	// If there is something, read and return
	if ($handle) {
		while (!feof($handle)) {
		    $buffer = fgets($handle, 4096);		    
		    
			$buffer = str_replace("content:encoded", "content", $buffer);
			$buffer = str_replace("slash:comments", "commentscount", $buffer);
			
			echo $buffer; 
		}
		fclose($handle);
	}
/*}else{
	echo 'no url';
}*/
?>
