<?php 
include_once "dbconn.php";

define( 'TAGTABLE', 'tags2'); 

$dbh->sqliteCreateAggregate('stdev',
    function (&$context, $row, $data) // step callback
    {
        if (isset($context) !== true) // $context is null at first
        {
            $context = array
            (
                'k' => 0,
                'm' => 0,
                's' => 0,
            );
        }

        if (isset($data) === true) // the standard is non-NULL values only
        {
            $context['s'] += ($data - $context['m']) * ($data - ($context['m'] += ($data - $context['m']) / ++$context['k']));
        }

        return $context;
    },
    function (&$context, $row) // finishing callback
    {
        if ($context['k'] > 0) // return NULL if no non-NULL values exist
        {
            return sqrt($context['s'] / $context['k']);
        }
        
        return null;
    }, 1);

function validate_user($user)
{
	global $dbh;

	$q = "Select uid, user, tagCount from users where user = ?";

	$stmt = $dbh->prepare($q);
	if(!$stmt->execute(array($user))) return false;
	$r = $stmt->fetch(PDO::FETCH_ASSOC);

	return $r;
}

function get_tweet($uid)
{
	global $dbh;
	
	$q = "Select * from filteredtweets order by randid limit 1 offset (select tagCount from users where uid = ?)";
	
	$stmt = $dbh->prepare($q);
	$stmt->execute(array($uid));
	$r = $stmt->fetch(PDO::FETCH_ASSOC);
	
	return $r;
}

function get_hashtags($twid)
{
	global $dbh;
	
	$q = "Select hashtag from hashtags where tweetid = ?";
	
	$stmt = $dbh->prepare($q);
	$stmt->execute(array($twid));
	$r = $stmt->fetchAll(PDO::FETCH_ASSOC);
	
	return $r;
}

function get_tweet_by_id($twid)
{
	global $dbh;
	
	$q = "Select * from filteredtweets where Id = ?";
	
	$stmt = $dbh->prepare($q);
	$stmt->execute(array($twid));
	$r = $stmt->fetch(PDO::FETCH_ASSOC);
	
	return $r;
}

function increment_user($uid)
{
	global $dbh;
	$q1 = "Update users set tagCount = tagCount + 1 where uid = ?";
	$stmt = $dbh->prepare($q1);

	return $stmt->execute(array($uid));
}

function tag_tweet($uid, $twid, $meta, $inf, $pers, $joke, $rid, $org, $grbg )
{
	global $dbh;
	$q  = "Insert or replace into " . TAGTABLE . " (uid, tweetid, metaphorical, informative, personal_account, joke, ridicule, organization, garbage) values (?,?,?,?,?,?,?,?,?)";
	$stmt = $dbh->prepare($q);
	if( $stmt->execute(array($uid, $twid, $meta, $inf, $pers, $joke, $rid, $org, $grbg) ) )
	{ 
		return increment_user($uid);	
	}
	return false;
}

function get_tag_table()
{
	global $dbh;

	$q = "Select * from " . TAGTABLE . ", users where users.uid = ".TAGTABLE.".uid group by ".TAGTABLE.".uid, tweetid order by tweetid";
	$stmt = $dbh->prepare($q);

	if( $stmt->execute(array()) )
	{
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
	
	return false;
}

function get_avg_tag_table()
{
	global $dbh;

	$q = "Select tweetid, count(uid) as ntags, avg(metaphorical) as metaphorical, avg(informative) as informative, avg(personal_account) as personal_account, avg(joke) as joke, avg(ridicule) as ridicule, avg(organization) as organization, avg(garbage) as garbage from " . TAGTABLE . " group by tweetid order by tweetid";
	$stmt = $dbh->prepare($q);

	if( $stmt->execute(array()) )
	{
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
	
	return false;
}

function get_stdev_tag_table()
{
	global $dbh;

	$q = "Select tweetid,count(uid) as ntags, stdev(metaphorical) as metaphorical, stdev(informative) as informative, stdev(personal_account) as personal_account, stdev(joke) as joke, stdev(ridicule) as ridicule, stdev(organization) as organization, stdev(garbage) as garbage from " . TAGTABLE . " group by tweetid order by tweetid";
	$stmt = $dbh->prepare($q);

	if( $stmt->execute(array()) )
	{
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
	
	return false;
}

?>