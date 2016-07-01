from __future__ import print_function

from pprint import pprint
from time import time
import logging

from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.linear_model import SGDClassifier, PassiveAggressiveClassifier
from sklearn.grid_search import GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.ensemble import AdaBoostClassifier, BaggingClassifier
import pickle
from scipy import stats

import dbmodels as dbm, json, random, time, os, agg_tag


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

def fetch_data():
    tags = agg_tag.get_tags()
    qr = [(dbm.Filteredtweets.select().where(t["tweetid"] == dbm.Filteredtweets.id).execute().next().__dict__['_data'], t) for t in tags]
    qr = [(u"{0} {1}".format(v['text'],v['creator']), t) for v,t in qr]
    return qr

def test(n_samples):
    results = {}
    qr = fetch_data()
    for c in ["informative","joke","metaphorical","organization","personal_account","ridicule"]:
        results[c+'-test'] = []
        results[c+'-train'] = []
    for i in range(n_samples):
        clfs = gen_clfs()
        n = len(qr)
        for c in clfs:
            random.shuffle(qr)
            train = qr[0:2 * n / 3]
            test = qr[2 * n / 3:]
            x_test, y_test = zip(*test)
            y_test = [t[c['name']] for t in y_test]
            x_train, y_train = zip(*train)
            y_train = [t[c['name']] for t in y_train]
            curr_clf = c['clf']
            results[c['name']+'-test'].append(curr_clf.score(x_test,y_test))
            results[c['name']+'-train'].append(curr_clf.score(x_train,y_train))
    return results

def describe_results(r):
    desc = {}
    print('param, mean, min, max, variance, skewness, kurtosis')
    for k in r:
        desc[k] = stats.describe(r[k]) 
        print(k, desc[k].mean, desc[k].minmax[0], desc[k].minmax[1], desc[k].variance, desc[k].skewness, desc[k].kurtosis)
    return desc

def main():
    r = test(50)
    with open("./%s.log"%(str(int(time.time()))),'w') as f:
        json.dump(r, f)
    describe_results(r)
    return

if __name__ == '__main__':
    main()