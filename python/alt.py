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
from sklearn.feature_selection import SelectFromModel
from sklearn.svm import LinearSVC
import pickle

import dbmodels as dbm, json, random, agg_tag


logging.basicConfig(level=logging.INFO,
                format='%(asctime)s %(levelname)s %(message)s')

pipeline = Pipeline([
    ('vect', CountVectorizer()),
    ('tfidf', TfidfTransformer(use_idf=False)),
    ('feature_selection', SelectFromModel(LinearSVC(penalty="l2"))),
    ('clf', BaggingClassifier(SGDClassifier(penalty='elasticnet', alpha=0.000001, n_iter=10, shuffle=True)))#PassiveAggressiveClassifier(loss='squared_hinge', C=0.1), algorithm='SAMME'))#SGDClassifier(penalty='elasticnet', alpha=0.000001, n_iter=10, shuffle=True)),
])
tags = agg_tag.get_tags()
qr = [(dbm.Filteredtweets.select().where(t["tweetid"] == dbm.Filteredtweets.id).execute().next().__dict__['_data'], t) for t in tags]
qr = [(u"{0} {1}".format(v['text'],v['creator']), t) for v,t in qr]
n = len(qr)
parameters = {
    'vect__max_df': (0.4, 0.7),
    #'vect__max_features': (None, 5000, 10000, 50000),
    'vect__ngram_range': ((1, 1),(1, 2),(1, 3),(1, 4),(1,5)),  # unigrams or bigrams
    #'tfidf__use_idf': (True, False),
    'tfidf__norm': ('l1', 'l2'),
    'tfidf__sublinear_tf': (True, False),
    'tfidf__smooth_idf': (True, False),
    #'clf__alpha': (0.00001, 0.000001),
    #'clf__penalty': ('l2','elasticnet'),
    #'clf__n_iter': (10, 50, 80),
    #'clf__loss': ('hinge', 'log', 'epsilon_insensitive', 'huber', 'perceptron', 'modified_huber'),
    #'clf__C': (0.1,0.2,0.3,0.4,0.5)
    'clf__n_estimators': range(1,20,1)
}

if __name__ == "__main__":

    results = {}
    for i in ['informative', 'joke', 'metaphorical', 'organization', 'personal_account', 'ridicule']: 
        grid_search = GridSearchCV(pipeline, parameters, n_jobs=16, verbose=1, scoring='accuracy')
        
        print()
        print("Performing grid search on {0}...".format(i))
        print("pipeline:", [name for name, _ in pipeline.steps])
        print("parameters:")
        
        pprint(parameters)
        
        t0 = time()
        random.shuffle(qr)
        train = qr[0:2 * n / 3]
        test = qr[2 * n / 3:]
        x_test, y_test = zip(*test)
        x_train, y_train = zip(*train)
        Y_train = [t[i] >= 0.5 for t in y_train]
        grid_search.fit(x_train, Y_train)
        # grid_search.
        print("done in %0.3fs" % (time() - t0))
        print()

        print("Best score: %0.3f" % grid_search.best_score_)
        print("Best parameters set:")
        pprint(grid_search.best_estimator_.get_params())
        with open('{0}_best_classifier.pkl'.format(i),'w') as f:
            pickle.dump(grid_search.best_estimator_, f)
        # results[i] = grid_search.best_estimator_.get_params()
        # results[i]['best_score'] = grid_search.best_score_
        # del results[i]['clf']
        # del results[i]['vect__dtype']
        # del results[i]['vect']
        # del results[i]['tfidf']
        # del results[i]['clf__base_estimator']
        # for param_name in sorted(parameters.keys()):
        #     print("\t%s: %r" % (param_name, results[i][param_name]))
    # pprint(results)
    # with open('grid_search_output.json', 'w') as f:
    #     json.dump(results,f)