# Twitter Analysis Package

This is a the collection of software tools used for the project presented in 
the our project on 
    Machine Learning, Sentiment Analysis, and Tweets: 
    An examination of Alzheimer's Disease stigma on Twitter

There are three components presented here. The tagging interface, the machine 
learning components, and the analysis tools.

## The Tagging interface (./Tagging Interface)

This is the PHP, HTML, and JavaScript web application 
that we used to manually tag tweets to train the classifiers.

This user interface was used to organize raters and present Tweets for 
tagging, and to manage tag data. While we provide this implementation for 
reference, we would recommend exploring other options for the coding 
interface. The PHP tooling involved is somewhat over complicated, and 
difficult to maintain and debug. 

A alternative might be Python combined with the Bottle web framework. Python 
provides more user friendly tools for managing the connection between the 
database and the user interface. This would also allow for direct 
integration of the machine learning tools and the tagging interface.

## The Machine Learning components (./python)

This is the set of tools used to train, test, and produce output from 
the classifiers. It relies on a series of dependencies that are described 
in the ./python/requirements.txt

## The Statistical Analysis (./R)

These are scripts used for checking the inter-rater reliability (icc) of our 
manual tags, and evaluating correlations between our tagged (or 
predicted results) and LIWC results over the same data.


## Data
There is a placeholder SQLite3 database (./Tagging Interface/alz.db). We are not able to
host this database publicly, contact us (oscarn@oregonstate.edu) for more 
information.

## Tweets Scraping and Storage
We have not provided our twitter scraping tool. For those interested in 
producing their own tools, we would recommend looking at current twitter 
clients.

Accessing and navigating the Twitter API requires some technical knowledge of 
internet requests and transactional data formats such as 
JavaScript Object Notation or JSON; see Introduction to JSON for a primer 
(Lennon, J. et al., (2009), and storage and organization of collected Tweets 
requires experience with databases, or other suitable data management techniques. 
While we chose to use a relational database at the time due to technical 
constraints, more user-friendly non-relational data management options are now 
available such as MongoDB, Azure Tables, and others (Dirolf, et al., 2010; 
Calder, et al., 2011). Maintaining our relational database was challenging, 
particularly during the formative stages of our analysis. 
Relational databases rely heavily on predefined schema, and changes to the 
schema quickly become unwieldy. To minimize these difficulties, we recommend 
using a non-relational database option. Because MongoDB is designed to work with 
the JSON format that Twitter uses natively, it would be particularly well suited 
for this purpose.  