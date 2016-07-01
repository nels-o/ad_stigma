<?php 

// db connection	
global $dbh;

$dbh = new PDO("sqlite:./alz.db");
$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING); //catch exceptions
?>