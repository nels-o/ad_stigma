import json, csv
from res_wrap import res_wrap

def merge(LIWC_result_csv_file, LIWC_tweetid_id_col, numerical_tagged_data_file, output_file, tagged_data_tweetid="id"):
    '''
    Merge LIWC Results with classifier tags by tweetid.
    '''
    liwc = {}
    with open(LIWC_result_csv_file,encoding="utf8") as f:
        liwc_reader = csv.DictReader(f)
        c = 0
        for row in liwc_reader:
            liwc[row[LIWC_tweetid_id_col]] = row
            c = c + 1
        print('LIWC Tweets',c)

    mlclass = {}
    with open(numerical_tagged_data_file, encoding="utf8") as f:
        mlclass = json.load(f)

    print('Tagged Tweets',len(mlclass['data']))

    result = {}
    for row in mlclass['data']:
        liwc_row = liwc.get(str(row[tagged_data_tweetid]),None)
        if liwc_row:
            if(result.get(row[tagged_data_tweetid],False)):
                print('duplicate', row)
            result[row[tagged_data_tweetid]] = row['tags'].copy()
            result[row[tagged_data_tweetid]].update(liwc_row)
        else:
            print("Missing Tweet in liwc")
            print(row)


    with open(output_file,'w', encoding="utf8", newline='') as f:
        writer = csv.DictWriter(f, result[list(result)[0]].keys(), )
        writer.writeheader()
        for r in result:
            writer.writerow(result[r])

    print('Resulting rows', len(result))


def main():
    import sys
    merge(sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5])

if __name__ == '__main__':
    main()