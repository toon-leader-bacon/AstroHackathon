curl -X POST http://127.0.0.1:8000/scrape_wikipedia -d "
  auth_token=B8dsbz4HExMskqUa6Qhn& \
  place[name]=Fuelstation Central& \
  place[city]=Grossbeeren& \
  place[address]=Buschweg 1& \
  place[latitude]=52.3601& \
  place[longitude]=13.3332& \
  place[washing]=true& \
  place[founded_at_year]=2000& \
  place[products][]=diesel& \
  place[products][]=benzin \
"

curl -X POST POST http://127.0.0.1:8000/scrape_wikipedia -H "Content-Type: application/json" -d "{\"url\":\"https://en.wikipedia.org/wiki/Alan_Turing\"}"