from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
login_resp = client.post('/login', json={'email': 'pranathi@example.com', 'password': '123456'})
token = login_resp.json()['access_token']
profile_resp = client.get('/me', headers={'Authorization': f'Bearer {token}'})
print(profile_resp.status_code)
print(profile_resp.text)
