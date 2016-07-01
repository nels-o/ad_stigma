var App = {
    config: {
        user: {},
        tweet: {},
        tags: [{
            name: "metaphorical",
            type: 'radio',
            question: "Is the tweet speaking literally or figuratively (metaphorically) with respect to Alzheimer's Disease, Dementia, or Cognitive Decline?",
            values: ["Literal", "Somewhat figurative", "Fairly figurative", "Significantly figurative", "Completely figurative", "Can't Tell"],
            desc: "Completely literal means the tweet is actually referring to Alzheimer's Disease, or dementia.",
            value: null,
            action: null
        }, {
            name: "informative",
            type: 'radio',
            question: "Is this tweet informative?",
            values: ["No", "Somewhat", "Fairly", "Significantly", "Completely", "Can't Tell"],
            desc: "",
            value: null,
            action: null
        }, {
            name: "personal_account",
            type: 'radio',
            question: "Is this a personal story about real events with respect to the person posting the tweet?",
            values: ["No", "Somewhat", "Fairly", "Significantly", "Completely", "Can't Tell"],
            desc: "qualify, tweets need to explicitly reference a personal experience of the person posting the Tweet, not just an opinion or reference to someone else's experience.",
            value: null,
            action: null
        }, {
            name: "joke",
            type: 'radio',
            question: "Is this a joke, or is it intended to be humorous?",
            values: ["No", "Somewhat", "Fairly", "Significantly", "Completely", "Can't Tell"],
            desc: "",
            value: null,
            action: null,
        }, {
            name: "ridicule",
            type: 'radio',
            question: "Is this ridiculing something or someone, or is it intended to be offensive?",
            values: ["No", "Somewhat", "Fairly", "Significantly", "Completely", "Can't Tell"],
            desc: "",
            value: null,
            action: null
        }, {
            name: "organization",
            question: "Do you think this is a person, or an organization?",
            type: 'radio',
            values: ["Person", "Organization"],
            desc: "",
            value: null,
            action: null
        }, {
            name: "garbage",
            type: 'checkbox',
            question: "This is not the tweet we're looking for. Use very sparingly",
            values: ["Flag this tweet as unrelated."],
            desc: "",
            value: null,
            action: null
        }],
        selectedTags: []
    },

    init: function() {
        // Login
        var uname = prompt("Username please:", "username");
        App.fetchUser(uname, true);
    },

    fetchUser: function(username, loadItemsP) {
        dm.validate_user(username)
            .success(function(data) {
                App.config.user = data;
                App.renderUser();
                if (loadItemsP) App.loadItem();

            });
    },

    renderUser: function() {
        $("#userStats")
            .html(App.config.user.user + " - " + App.config.user.tagCount + "/100");
    },

    loadItem: function() {
        dm.get_tweet(App.config.user.uid)
            .success(function(data) {
                App.config.tweet = data;
                App.renderItem();
            });
    },

    renderItem: function() {
        console.log(App.config);
        var container = $('#tweet');
        var hashtags = $("<span class='hashtags'></span>");
        container.html("<span class='tweet'>Tweet: " + App.config.tweet.Text + "</span>");
        container.append("<br>");
        container.append(hashtags);
        container.append("<br><span class='author'>By: " + App.config.tweet.Creator + "</span>");
        container.append("<br><span class='date'>Created At: " + App.config.tweet.CreatedAt + "</span>");
        container.append("<br><span class='retweet'>Retweet? " + App.config.tweet.IsRetweet + "</span>");
        container.append("<br><span class='reply'>Reply? " + (App.config.tweet.InReplyToStatusId !== "NULL") + "</span>");
        container.append("<br><a href='https://twitter.com/#!/srr/status/" + App.config.tweet.IdStr + "'>go to tweet</a> (May not always work!)");
        dm.get_hashtags(App.config.tweet.Id)
            .success(function(data) {
                data.map(function(a, b) {
                    hashtags.append(data[b].hashtag + " ");
                });
            });

        App.renderTags();
    },

    renderTags: function() {
        var tags = $("#tagging");
        tags.empty();
        var c = $('<p></p>');
        var b = $("<button type='button'>Submit Tags</button>");
        b.click(App.tagItem);
        App.config.tags.map(function(a, b) {
            var inner = $("<div class='tagPrompt' id=" + App.config.tags[b].name + "><span class='question'>" + App.config.tags[b].question + "</span><br></div>");
            App.config.tags[b].values.map(function(d, e) {
                var cont = $("<span ></span>");
                var item = $("<input type='" + App.config.tags[b].type + "' name=" + App.config.tags[b].name + " value='" + e + " ' title='" + App.config.tags[b].desc + "'>");
                item.click(function() {
                    switch (App.config.tags[b].type) {
                        case 'radio':
                            App.config.tags[b].value = e;
                            break;
                        case 'checkbox':
                            App.config.tags[b].value = item.is(':checked');
                            break;
                        default:
                            alert('Invalid form type');
                            break;
                    }
                    console.log(App.config);
                    if (App.config.tags[b].action != null)
                        App.config.tags[b].action();

                });

                cont.append(item).append(App.config.tags[b].values[e]);
                inner.append(cont)
            });
            tags.append(inner);
            $()
        });

        tags.append(c);
        tags.append(b);
    },

    tagItem: function() {
        // tag tweet.
        vals = App.config.tags;
        if (vals[6].value) {
            if (confirm("Are you sure this one is junk?")) {
                dm.tag_tweet_as_junk(App.config.user.uid, App.config.tweet.Id)
                    .success(function(data) {
                        App.config.tweet = data;
                        App.fetchUser(App.config.user.user, true);
                    })
                    .error(function(err) {
                        console.log(err);
                        console.log('error submitting: ');
                        alert(err + "    Check with Nels.");
                    });
            }
        } else if( vals[1].value == null || 
                   vals[2].value == null || 
                   vals[3].value == null || 
                   vals[4].value == null ||
                   vals[5].value == null )
        {
            alert("Please fill in all of the tags before submitting.");
        } else {

            dm.tag_tweet(App.config.user.uid, App.config.tweet.Id, vals[0].value, vals[1].value, vals[2].value, vals[3].value, vals[4].value, vals[5].value)
                .success(function(data) {
                    App.config.tweet = data;
                    App.fetchUser(App.config.user.user, true);
                })
                .error(function(err) {
                    console.log(err);
                    console.log('error submitting: ');
                    alert(err + "    Check with Nels.");
                });

        }
    }
};

$(function() {
    App.init();
    $('.tooltipster').tooltipster();
});
