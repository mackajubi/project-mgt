FROM caddy

ADD ./dist/vehicle-master-ui /usr/share/caddy

COPY ./Caddyfile /etc/caddy

EXPOSE 80 443

# CMD caddy run