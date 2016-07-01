import json
from res_wrap import res_wrap

file = '1467285447.38_classifier_results'
def to_numerical_tags(file):
    mlclass = {}
    with open(file+'.json', encoding="utf8") as f:
        mlclass = json.loads(f.read())

    result = []
    for r in mlclass['data']:
        result.append(res_wrap(r));

    with open(file+'_numerical.json','w', encoding="utf8") as f:
        json.dump({'data':result},f)