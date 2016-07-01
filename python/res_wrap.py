tags = [
    'joke',
    'ridicule', 
    'personal_account', 
    'metaphorical', 
    'informative', 
    'organization'
    ] 

def res_wrap(t):
    return {
        'id': t['idstr'],
        'tags': {tag: int(t[tag]) for tag in tags}
        }