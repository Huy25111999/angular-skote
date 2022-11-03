npm -v
node -v
npm i
npm run build
docker build -t sso-fe-app:local-latest -f Dockerfile --no-cache .
docker-compose -f compose-file.yaml up -d
