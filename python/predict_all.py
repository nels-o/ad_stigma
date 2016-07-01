import pickle

import app.dbmodels as dbm, json, random,time

def load_clf(name):
    with open(name+'_best_classifier.pkl') as f:
        return pickle.load(f)

def gen_clfs():
    return [{'name':"informative"      , 'clf': load_clf('informative') }, 
            {'name':"joke"             , 'clf': load_clf('joke') }, 
            {'name':"metaphorical"     , 'clf': load_clf('metaphorical') }, 
            {'name':"organization"     , 'clf': load_clf('organization') }, 
            {'name':"personal_account" , 'clf': load_clf('personal_account') }, 
            {'name':"ridicule"         , 'clf': load_clf('ridicule') }]

tweets = dbm.Filteredtweets.select()
full_data = [t.__dict__['_data'] for t in tweets] 
values = [(t['idstr'], u"({0} {1}".format(t['text'],t['creator'])) for t in full_data]

n = len(values)

clfs = gen_clfs()

for clf in clfs:
    predictions = clf['clf'].predict([v[1] for v in values])
    predictions = predictions.tolist()
    for t,p in zip(full_data, predictions):
        t[clf['name']] = p

with open('{0}_classifier_results.json'.format(time.time()), 'w') as f:
    json.dump({'data':full_data}, f)

