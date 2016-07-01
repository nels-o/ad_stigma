Twitter Analysis Package

This is a the collection of software tools used for the project presented in 
the our project on 
    Machine Learning, Sentiment Analysis, and Tweets: 
    An examination of Alzheimer's Disease stigma on Twitter

There are three main components presented here:

1) The Tagging interface (./Tagging Interface)

    This is the PHP, HTML, and JavaScript web application 
    that we used to manually tag tweets to train the classifiers.

2) The Machine Learning components (./python)

    This is the set of tools used to train, test, and produce output from 
    the classifiers. It relies on a series of dependencies that are described 
    in the ./python/requirements.txt

3) The Statistical Analysis (./R)

    These are scripts used for checking the inter-rater reliability of our 
    manual tags, and evaluating correlations between our tagged (or 
    predicted results) and LIWC results over the same data.

There is a placeholder database (./Tagging Interface/alz.db). We are not able to
host this database publicly, contact us (oscarn@oregonstate.edu) for more 
information.