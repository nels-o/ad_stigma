var dm = {
    validate_user: function(username, loadItemsP) {
        return $.ajax({
            type: "get",
            url: './twit.php',
            data: {
                login: '',
                user: username
            }
        });
    },

    get_tweet: function(uid) {
        return $.ajax({
            type: "get",
            url: './twit.php',
            data: {
                get_tweet: '',
                uid: uid
            }
        });
    },

    get_hashtags: function(twid) {
        return $.ajax({
            type: "get",
            url: './twit.php',
            data: {
                hashtags: twid,
            }
        });
    },

    get_tweet_by_id: function(twid) {
        return $.ajax({
            type: "get",
            url: './twit.php',
            data: {
                tweet: twid
            }
        });
    },

    tag_tweet: function(uid, twid, meta, inf, pers, joke, rid, org) {
        return $.ajax({
            type: "get",
            url: './twit.php',
            data: {
                tag_tweet: '',
                uid: uid,
                tweetid: twid,
                metaphorical: meta,
                informative: inf,
                personal_account: pers,
                joke: joke,
                ridicule: rid,
                organization: org,
                garbage: false
            }
        });
    },

    tag_tweet_as_junk: function(uid, twid) {
        return $.ajax({
            type: "get",
            url: './twit.php',
            data: {
                tag_tweet: '',
                uid: uid,
                tweetid: twid,
                metaphorical: 'NULL',
                informative: 'NULL',
                personal_account: 'NULL',
                joke: 'NULL',
                ridicule: 'NULL',
                organization: 'NULL',
                garbage: true
            }
        });
    },

    get_tag_table: function() {
        return $.ajax({
            type: "get",
            url: './twit.php',
            data: {
                tag_table: '',
            }
        });
    },
};
