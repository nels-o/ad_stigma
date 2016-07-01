from __future__ import print_function
import sqlite3

def get_tags():
    db_location = '../Tagging\ Interface/alz.db'
    conn = sqlite3.connect(db_location)

    # Select all tagged tweets by raters A and B, 
    # excluding tweets that were flagged as garbage and
    # tweets that contain the pain text "memory loss" which 
    # was a problem for coding reliability.
    # A and B coded in 3 sessions, that are recorded under different user ids
    #   A coded under 2, 6, and 8.
    #   B coded under 5, 7, and 9.
    query_batch_3_no_mem_loss = """
        select distinct a.tweetid, a.metaphorical, a.informative, a.personal_account, a.joke, a.ridicule, a.organization, a.garbage, 
                                   b.metaphorical, b.informative, b.personal_account, b.joke, b.ridicule, b.organization, b.garbage 
        from (select distinct tweetid, metaphorical, informative, personal_account, joke, ridicule, organization, garbage 
              from tags2 
              where (uid = 2 OR uid = 6 OR uid = 8) AND 
                     not tweetid = 'NULL' AND 
                     not garbage = 'true') a, 
              (select distinct tweetid, metaphorical, informative, personal_account, joke, ridicule, organization, garbage 
               from tags2 
               where (uid = 5 OR uid = 7 OR uid = 9) AND 
                      not tweetid = 'NULL' AND 
                      not garbage = 'true') b 
        where a.tweetid == b.tweetid and 
              a.tweetid not in (select id as tweetid 
                                from tweets 
                                where text like '%memory loss%')
        """

    header = ["tweetid", 
              "a.metaphorical", 
              "a.informative", 
              "a.personal_account", 
              "a.joke", 
              "a.ridicule", 
              "a.organization", 
              "a.garbage", 
              "b.metaphorical", 
              "b.informative", 
              "b.personal_account", 
              "b.joke", 
              "b.ridicule", 
              "b.organization", 
              "b.garbage"]

    c = conn.cursor()
    batch_3 = c.execute(query_batch_3_no_mem_loss).fetchall()
    c.close()
    conn.close()
    aod = []
    for tagset in batch_3:
        aod.append(dict(zip(header, tagset)))

    # Union tags from raters A and B
    # Tags are on a 0-5 code scale. 
    #    0-4 represent magnitude of rater certainty; 
    #    this is coded 0-1 for this analysis.
    #    5 Represents not applicable, or the rater 
    #    is unable to say. It is recoded as 0.
    #
    # To union rater responses, we rely on the average and
    # favor negative in the case of a tie. 
    #    Given a tweet t, raters a and b, and dimension d
    #    a codes t 0 on d, b codes t 1 on d
    #    (t_ad + t_bd) / 2.0 > 0.5 == (0 + 1) / 2.0 == False == 0

    mapped_aod = {}
    for tagset in aod:
        union_tags = {}
        union_tags["tweetid"] = tagset["tweetid"];
        union_tags["metaphorical"] = int(((tagset["a.metaphorical"] + tagset["b.metaphorical"]) / 2.0) > 0.5)
        union_tags["informative"] = int(((tagset["a.informative"] + tagset["b.informative"]) / 2.0) > 0.5)
        union_tags["personal_account"] = int(((tagset["a.personal_account"] + tagset["b.personal_account"]) / 2.0) > 0.5)
        union_tags["joke"] = int(((tagset["a.joke"] + tagset["b.joke"]) / 2.0) > 0.5)
        union_tags["ridicule"] = int(((tagset["a.ridicule"] + tagset["b.ridicule"]) / 2.0) > 0.5)
        union_tags["organization"] = int(((tagset["a.organization"] + tagset["b.organization"]) / 2.0) > 0.5)
        mapped_aod[tagset["tweetid"]] = union_tags

    return [mapped_aod[k] for k in mapped_aod]

def to_json(fname):
    import json
    with open(fname,'w') as f:
        json.dump({"data": get_tags()},f)