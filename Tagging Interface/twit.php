<?php 
include_once "func.php";

header("Content-type: application/json");

if(array_key_exists("get_tweet", $_GET) && array_key_exists("uid", $_GET))
{
	echo json_encode(get_tweet($_GET["uid"]));
	die;
}
else if(array_key_exists("tag_tweet",        $_GET) && 
	    array_key_exists("uid",              $_GET) &&
	    array_key_exists("tweetid",          $_GET) && 
	    array_key_exists("metaphorical",     $_GET) && 
	    array_key_exists("informative",      $_GET) && 
	    array_key_exists("personal_account", $_GET) &&
	    array_key_exists("joke",             $_GET) && 
	    array_key_exists("ridicule",         $_GET) && 
	    array_key_exists("organization",     $_GET) && 
	    array_key_exists("garbage",          $_GET) )
{

	array_push($rs, tag_tweet($_GET["uid"],
		                      $_GET["tweetid"],
		                      $_GET["metaphorical"],
		                      $_GET["informative"],
		                      $_GET["personal_account"],
		                      $_GET["joke"],
		                      $_GET["ridicule"],
		                      $_GET["organization"],
		                      $_GET["garbage"]));
	
	echo json_encode($rs);
	die;
}
else if(array_key_exists("login", $_GET) && array_key_exists("user", $_GET))
{
	echo json_encode(validate_user($_GET["user"]));
	die;
}
else if(array_key_exists("tweet", $_GET))
{
	echo json_encode(get_tweet_by_id($_GET["tweet"]));
	die;
}
else if(array_key_exists("hashtags", $_GET))
{
	echo json_encode(get_hashtags($_GET["hashtags"]));
	die;
}
else if(array_key_exists("tag_table", $_GET))
{
	echo json_encode(get_tag_table());
	die;
}
else if(array_key_exists("avg_tag_table", $_GET))
{
	echo json_encode(get_avg_tag_table());
	die;
}
else if(array_key_exists("stdev_tag_table", $_GET))
{
	echo json_encode(get_stdev_tag_table());
	die;
}
echo "error";
die;
?>