import pprint
import requests
import time
import unittest

URL = 'https://myphotos1088001.herokuapp.com{}'
#URL = 'http://localhost:5000{}'
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

class TestSequence(unittest.TestCase):

    def test_21_delete_all_records(self):
        r = _delete('/records')
        _pprint(r, 'DELETE /records')
        self.assertEqual(r.status_code, 200)

if __name__ == '__main__':
    unittest.main(verbosity=2, warnings='ignore')
