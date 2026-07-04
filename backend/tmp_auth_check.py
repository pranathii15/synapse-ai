from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
resp = client.post('/login', json={'email': 'pranathi@example.com', 'password': '123456'})
print(resp.status_code)
print(resp.text)
