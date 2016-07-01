<?php 

include_once "dbconn.php";
set_time_limit(5000);
echo "<h2>Init a new tagging session</h2><br>";


$q = "Select * from filteredtweets order by randid";

$stmt = $dbh->prepare($q);
$stmt->setFetchMode(PDO::FETCH_ASSOC);

if(!$stmt->execute(array())) echo  "Error Executing Statement";

$s = "update filteredtweets set randid = ? where Id = ?";
$ins = $dbh->prepare($s);
$dbh->beginTransaction();
$c = 0;
while($r = $stmt->fetch(PDO::FETCH_ASSOC))
{
	try
	{
		echo ".";
		$ins->execute(array($c,$r['Id']));
		$c = $c + 1;
		if($c % 1000 == 0) 
		{
			echo "<br>Committing...<br>";
			$dbh->commit();
			echo "<br>Committed...<br>";
			$dbh->beginTransaction();
		}
 	}catch(Exception $e)
 	{
 		echo '<br>Caught exception: ',  $e->getMessage(), "<br>";
 	}
}
echo "<br>Committing...<br>";
$dbh->commit();
echo "<br>Complete"
?>


