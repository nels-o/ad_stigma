from peewee import *

db_location = '../Tagging\ Interface/alz.db'
database = SqliteDatabase(db_location, **{})

class UnknownField(object):
    pass

class BaseModel(Model):
    class Meta:
        database = database

class Filteredtweets(BaseModel):
    createdat = DateTimeField(db_column='CreatedAt', null=True)  # num
    creator = TextField(db_column='Creator', null=True)
    favourited = BooleanField(db_column='Favourited', null=True)  # num
    id = PrimaryKeyField(db_column='Id', null=False, unique=True)
    idstr = TextField(db_column='IdStr', null=True)
    inreplytoscreenname = TextField(db_column='InReplyToScreenName', null=True)
    inreplytostatusid = TextField(db_column='InReplyToStatusId', null=True)
    inreplytostatusidstr = TextField(db_column='InReplyToStatusIdStr', null=True)
    inreplytouserid = TextField(db_column='InReplyToUserId', null=True)
    inreplytouseridstr = TextField(db_column='InReplyToUserIdStr', null=True)
    isretweet = BooleanField(db_column='IsRetweet', null=True)  # num
    istweetdestroyed = BooleanField(db_column='IsTweetDestroyed', null=True)  # num
    istweetpublished = BooleanField(db_column='IsTweetPublished', null=True)  # num
    length = TextField(db_column='Length', null=True)
    possiblysensitive = BooleanField(db_column='PossiblySensitive', null=True)  # num
    retweetcount = TextField(db_column='RetweetCount', null=True)
    retweeted = BooleanField(db_column='Retweeted', null=True)  # num
    retweetedtweet = BooleanField(db_column='RetweetedTweet', null=True)  # num
    source = TextField(db_column='Source', null=True)
    text = TextField(db_column='Text', null=True)
    truncated = BooleanField(db_column='Truncated', null=True)  # num
    randid = TextField()

    class Meta:
        db_table = 'filteredtweets'


class Tags(BaseModel):
    garbage = TextField(null=True)
    informative = IntegerField(null=True)
    metaphorical = IntegerField(null=True)
    organization = IntegerField(null=True)
    personal_account = IntegerField(null=True)
    ridicule_joke = IntegerField(null=True)
    tid = PrimaryKeyField()
    tweetid = ForeignKeyField(Filteredtweets, db_column='tweetid')  # varchar
    uid = IntegerField(null=True)

    class Meta:
        db_table = 'tags'

class Tags1(BaseModel):
    garbage = TextField(null=True)
    informative = IntegerField(null=True)
    joke = IntegerField(null=True)
    metaphorical = IntegerField(null=True)
    organization = IntegerField(null=True)
    personal_account = IntegerField(null=True)
    ridicule = IntegerField(null=True)
    tid = PrimaryKeyField(null=True)
    tweetid = ForeignKeyField(Filteredtweets, db_column='tweetid')  # varchar
    uid = IntegerField(null=True)

    class Meta:
        db_table = 'tags1'

class Tags2(BaseModel):
    garbage = BooleanField(null=True)
    informative = BooleanField(null=True)
    joke = BooleanField(null=True)
    metaphorical = BooleanField(null=True)
    organization = BooleanField(null=True)
    personal_account = BooleanField(null=True)
    ridicule = BooleanField(null=True)
    tid = PrimaryKeyField(null=False)
    tweetid = ForeignKeyField(Filteredtweets, db_column='tweetid', null=True)  # varchar
    uid = TextField(null=True)

    class Meta:
        db_table = 'tags2'



class Users(BaseModel):
    pass_ = TextField(db_column='pass', null=True)  # varchar
    tagcount = IntegerField(db_column='tagCount', null=True)
    uid = PrimaryKeyField(null=True, unique=True)
    user = TextField(null=True)  # varchar

    class Meta:
        db_table = 'users'

class Tweets(BaseModel):
    createdat = DateField(db_column='CreatedAt', null=True)
    creator = TextField(db_column='Creator', null=True)  # varchar
    favourited = BooleanField(db_column='Favourited', null=True)
    id = PrimaryKeyField(db_column='Id', null=False, primary_key=True)  # varchar
    idstr = TextField(db_column='IdStr', null=True)  # varchar
    inreplytoscreenname = TextField(db_column='InReplyToScreenName', null=True)  # varchar
    inreplytostatusid = TextField(db_column='InReplyToStatusId', null=True)  # varchar
    inreplytostatusidstr = TextField(db_column='InReplyToStatusIdStr', null=True)  # varchar
    inreplytouserid = TextField(db_column='InReplyToUserId', null=True)  # varchar
    inreplytouseridstr = TextField(db_column='InReplyToUserIdStr', null=True)  # varchar
    isretweet = BooleanField(db_column='IsRetweet', null=True)
    istweetdestroyed = BooleanField(db_column='IsTweetDestroyed', null=True)
    istweetpublished = BooleanField(db_column='IsTweetPublished', null=True)
    length = TextField(db_column='Length', null=True)
    possiblysensitive = BooleanField(db_column='PossiblySensitive', null=True)
    retweetcount = TextField(db_column='RetweetCount', null=True)
    retweeted = BooleanField(db_column='Retweeted', null=True)
    retweetedtweet = TextField(db_column='RetweetedTweet', null=True)
    source = TextField(db_column='Source', null=True)  # varchar
    text = TextField(db_column='Text', null=True)  # varchar
    truncated = BooleanField(db_column='Truncated', null=True)

    class Meta:
        db_table = 'tweets'

class Tags3(BaseModel):
    garbage = BooleanField(null=True)
    informative = BooleanField(null=True)
    joke = BooleanField(null=True)
    metaphorical = BooleanField(null=True)
    organization = BooleanField(null=True)
    personal_account = BooleanField(null=True)
    ridicule = BooleanField(null=True)
    tid = PrimaryKeyField(null=False, primary_key=True)
    tweetid = ForeignKeyField(Tweets, db_column='Id', null=True)  # varchar
    uid = TextField(null=True)

    class Meta:
        db_table = 'tags3'

class AggregateTags(BaseModel):
    tagid = PrimaryKeyField()
    tweetid = TextField(null=False)  # varchar
    informative = DoubleField(null=False)
    joke = DoubleField(null=False)
    metaphorical = DoubleField(null=False)
    organization = DoubleField(null=False)
    personal_account = DoubleField(null=False)
    ridicule = DoubleField(null=False)
    garbage = DoubleField(null=False)
    nvoters = IntegerField(null=False)

    class Meta:
        db_table = 'aggregate_tags'