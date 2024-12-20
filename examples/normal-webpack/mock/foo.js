const data = {
  "users": [
      {
          "id": 1,
          "firstName": "Emily",
          "lastName": "Johnson",
          "maidenName": "Smith",
          "age": 28,
          "gender": "female",
          "email": "emily.johnson@x.dummyjson.com",
          "phone": "+81 965-431-3024",
          "username": "emilys",
          "password": "emilyspass",
          "birthDate": "1996-5-30",
          "image": "https://dummyjson.com/icon/emilys/128",
          "bloodGroup": "O-",
          "height": 193.24,
          "weight": 63.16,
          "eyeColor": "Green",
          "hair": {
              "color": "Brown",
              "type": "Curly"
          },
          "ip": "42.48.100.32",
          "address": {
              "address": "626 Main Street",
              "city": "Phoenix",
              "state": "Mississippi",
              "stateCode": "MS",
              "postalCode": "29112",
              "coordinates": {
                  "lat": -77.16213,
                  "lng": -92.084824
              },
              "country": "United States"
          },
          "macAddress": "47:fa:41:18:ec:eb",
          "university": "University of Wisconsin--Madison",
          "bank": {
              "cardExpire": "03/26",
              "cardNumber": "9289760655481815",
              "cardType": "Elo",
              "currency": "CNY",
              "iban": "YPUXISOBI7TTHPK2BR3HAIXL"
          },
          "company": {
              "department": "Engineering",
              "name": "Dooley, Kozey and Cronin",
              "title": "Sales Manager",
              "address": {
                  "address": "263 Tenth Street",
                  "city": "San Francisco",
                  "state": "Wisconsin",
                  "stateCode": "WI",
                  "postalCode": "37657",
                  "coordinates": {
                      "lat": 71.814525,
                      "lng": -161.150263
                  },
                  "country": "United States"
              }
          },
          "ein": "977-175",
          "ssn": "900-590-289",
          "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36",
          "crypto": {
              "coin": "Bitcoin",
              "wallet": "0xb9fc2fe63b2a6c003f1c324c3bfa53259162181a",
              "network": "Ethereum (ERC20)"
          },
          "role": "admin"
      },
      {
          "id": 2,
          "firstName": "Michael",
          "lastName": "Williams",
          "maidenName": "",
          "age": 35,
          "gender": "male",
          "email": "michael.williams@x.dummyjson.com",
          "phone": "+49 258-627-6644",
          "username": "michaelw",
          "password": "michaelwpass",
          "birthDate": "1989-8-10",
          "image": "https://dummyjson.com/icon/michaelw/128",
          "bloodGroup": "B+",
          "height": 186.22,
          "weight": 76.32,
          "eyeColor": "Red",
          "hair": {
              "color": "Green",
              "type": "Straight"
          },
          "ip": "12.13.116.142",
          "address": {
              "address": "385 Fifth Street",
              "city": "Houston",
              "state": "Alabama",
              "stateCode": "AL",
              "postalCode": "38807",
              "coordinates": {
                  "lat": 22.815468,
                  "lng": 115.608581
              },
              "country": "United States"
          },
          "macAddress": "79:15:78:99:60:aa",
          "university": "Ohio State University",
          "bank": {
              "cardExpire": "02/27",
              "cardNumber": "6737807858721625",
              "cardType": "Elo",
              "currency": "SEK",
              "iban": "83IDT77FWYLCJVR8ISDACFH0"
          },
          "company": {
              "department": "Support",
              "name": "Spinka - Dickinson",
              "title": "Support Specialist",
              "address": {
                  "address": "395 Main Street",
                  "city": "Los Angeles",
                  "state": "New Hampshire",
                  "stateCode": "NH",
                  "postalCode": "73442",
                  "coordinates": {
                      "lat": 79.098326,
                      "lng": -119.624845
                  },
                  "country": "United States"
              }
          },
          "ein": "912-602",
          "ssn": "108-953-962",
          "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/97.0.1072.76 Safari/537.36",
          "crypto": {
              "coin": "Bitcoin",
              "wallet": "0xb9fc2fe63b2a6c003f1c324c3bfa53259162181a",
              "network": "Ethereum (ERC20)"
          },
          "role": "admin"
      },
  ],
  "total": 208,
  "skip": 0,
  "limit": 30
}

module.exports = {
  'GET /api/foo': (req, res) => {
    res.json(data);
  },
};
