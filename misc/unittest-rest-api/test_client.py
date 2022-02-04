import pprint
import requests
import time
import unittest

URL = 'https://myphotos1088001.herokuapp.com{}'
# URL = 'http://localhost:5000{}'
headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}
headers_binary = {'Accept': 'application/json', 'Content-Type': 'application/octet-stream'}

def _post(path, body):
    return requests.post(URL.format(path), json=body, headers=headers)

def _post_binary(path, body):
    return requests.post(URL.format(path), data=body, headers=headers_binary)

def _put(path, body):
    return requests.put(URL.format(path), json=body, headers=headers)

def _get(path):
    return requests.get(URL.format(path))

def _delete(path):
    return requests.delete(URL.format(path))

def _pprint(resp, comment=None):
    print()
    if comment:
        print(comment)

        print('status code: {}'.format(resp.status_code))

        if resp.status_code == 200:
            try:
                pprint.pprint(resp.json())
            except:
                print(resp.text)
        else:
            print(resp.text)

with open('./pictures/Sankei1.jpg', 'rb') as f:
    pic_sankei1 = f.read()

with open('./pictures/Sankei2.jpg', 'rb') as f:
    pic_sankei2 = f.read()

with open('./pictures/Tsujido.jpg', 'rb') as f:
    pic_tsujido = f.read()

record_sankei1 = {'place': 'sankei1', 'memo': 'I visited Sankeien in 2021'}
record_sankei2 = {'place': 'sankei2', 'memo': 'I like visiting Sankeien'}
record_tsujido = {'place': 'tsujido', 'memo': 'I want to visit Tsujido again'}

class TestSequence(unittest.TestCase):

    # def setUp(self):
    #    r = _delete('/records')

    def test_00_post_records(self):
        r = _post('/records', record_sankei1)
        _pprint(r, 'POST /records -- record_sankei1')
        self.assertEqual(r.status_code, 200)
        id_ = r.json()['id']
        r = _post_binary('/photos/{}'.format(id_), pic_sankei1)
        _pprint(r, 'POST /photos -- pic1')
        self.assertEqual(r.status_code, 200)

        r = _post('/records', record_sankei2)
        _pprint(r, 'POST /records -- record_sankei2')
        self.assertEqual(r.status_code, 200)
        id_ = r.json()['id']
        r = _post_binary('/photos/{}'.format(id_), pic_sankei2)
        _pprint(r, 'POST /photos -- pic2')
        self.assertEqual(r.status_code, 200)

        r = _post('/records', record_tsujido)
        _pprint(r, 'POST /records -- record_tsujido')
        self.assertEqual(r.status_code, 200)
        id_ = r.json()['id']
        r = _post_binary('/photos/{}'.format(id_), pic_tsujido)
        _pprint(r, 'POST /photos -- tsujido')
        self.assertEqual(r.status_code, 200)

    def test_10_get_records(self):
        r = _get('/records')
        _pprint(r, 'GET /records')
        self.assertEqual(r.status_code, 200)

    def test_20_delete_lastest_record(self):
        r = _get('/records')
        print(r)
        id_ = r.json()[-1]['id']
        r = _delete('/records/{}'.format(id_))
        _pprint(r, 'DELETE /records/{}'.format(id_))
        self.assertEqual(r.status_code, 200)

if __name__ == '__main__':
    unittest.main(verbosity=2, warnings='ignore')
