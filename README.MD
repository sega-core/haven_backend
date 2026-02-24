
1) катим фронт, бэк, базу
2) запускаем docker-compose.yml
3) выпускаем серты 

  <!-- docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d yourhaven.ru \
  --email kornienko955@gmail.com \
  --agree-tos \
  --no-eff-email -->

4) меняем дефолтный конфиг nginx 

  <!-- docker cp nginx_ssl.conf haven_client_frontend:/etc/nginx/conf.d/default.conf
  docker exec haven_client_frontend nginx -s reload -->

  Проверка конфига nginx 
  
   <!--  docker exec haven_client_frontend cat /etc/nginx/conf.d/default.conf -->

   <!--docker compose restart frontend -->

5) если бэк ругается на original: error: password authentication failed for user "postgres"

  <!-- docker exec -it haven_postgres psql -U postgres
  ALTER USER postgres WITH PASSWORD 'root';
  \q -->