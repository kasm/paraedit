<?php
//var_dump($_GET);

//echo '<br>TTTTTT<br>';

//var_dump($_POST);

//echo 'php';

switch ($_GET['op']) {
    
  case 'filejson':
        
	$inp = file_get_contents('php://input');
	if (!file_put_contents('fem_json_in.txt', $inp)) echo 'cant write file';

	exec('FEM1.exe');
	$inp2 = file_get_contents('fem_json_out.txt');
        
	echo $inp2;
        break;
    
case 'clijson':
        echo exec('python pytest.py');
        break;

case 'loadpage':
$ip = "sdsd";
$ip = $_SERVER['REMOTE_ADDR']; 
$log2 = date("Y-m-d H:i:s", time()) .  " | ". $ip . "\n";
file_put_contents("paraed.mylog", $log2, FILE_APPEND); 
echo $ip; echo "<br>";
echo $log2;
break;
default:
        // code...
        
	break;
}

$inp =  file_get_contents('php://input');

if (!file_put_contents('file2', $inp)) echo 'cant write file';




?> 