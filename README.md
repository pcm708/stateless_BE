## High level Diagram:
![image](https://github.com/pcm708/stateless_BE/assets/52307892/93dbda69-e0ac-42e7-979f-250e4d885761)


### APIs:
**auth:** 
- curl --location --request POST 'http://127.0.0.1:8081/api/v1/auth/signup'
- curl --location 'http://127.0.0.1:8081/api/v1/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "waldolarson@ruecker.org",
    "password": "7wa7dv6g"

}'
**findMatches:**
- curl --location 'http://localhost:8080/users/matches?radius=500&genderPreference=male' \
--header 'Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ3YWxkb2xhcnNvbkBydWVja2VyLm9yZyIsImV4cCI6MTcxMTI4Njk3NiwiaWF0IjoxNzExMjg2Njc2fQ.YKL_Qxqe9ZlYmmqRkr4irmLMvxqpeIusew1VNF-Au6KIlKNB44zC3YHuufuJaqwoZxgFKKrGva_7uISr4FZJCQ'
