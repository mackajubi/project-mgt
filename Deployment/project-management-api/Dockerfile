############################################################
# Dockerfile to build Flask App
# Based on
############################################################

# Set the base image
# FROM debian:bullseye-slim
FROM python:3.7.4

# File Author / Maintainer
LABEL image.author="mark.kajubi@unra.go.ug"

RUN apt-get update && apt-get install -y apache2 \
    libapache2-mod-wsgi-py3 \
    telnet \
    python3 \
    python3-pip \
    && apt-get clean \
    && apt-get autoremove \
    && rm -rf /var/lib/apt/lists/*

# OpenCensus Python SDK
RUN python -m pip install opencensus-ext-azure

# Install ODBC Drivers
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
RUN curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list
RUN apt-get update
RUN ACCEPT_EULA=Y apt-get install -y msodbcsql17
RUN apt-get install -y unixodbc-dev

# Copy over and install the requirements
COPY ./requirements.txt /var/www/apache-flask/requirements.txt
RUN pip install --no-cache-dir -r /var/www/apache-flask/requirements.txt

# Copy over the apache configuration file and enable the site
COPY ./apache-flask.conf /etc/apache2/sites-available/apache-flask.conf

# Copy over the wsgi file, run.py and the app
COPY ./app /var/www/apache-flask/

# SET Environment Variables
# # Database - TEST
# ENV DATABASE_DRIVER {ODBC Driver 17 for SQL Server}
# ENV DATABASE_SERVER 192.168.26.107
# ENV DATABASE_NAME ProjectMgt
# ENV DATABASE_UID eclipse-3
# ENV DATABASE_PWD QW!Aub&pSjB@5

# Database - PROD
ENV DATABASE_DRIVER {ODBC Driver 17 for SQL Server}
ENV DATABASE_SERVER unrasqlsrv.database.windows.net
ENV DATABASE_NAME ProjectMgt
ENV DATABASE_UID unrasql
ENV DATABASE_PWD A4*unra2

# AZURE SSO
ENV AZURE_HOME_ACCOUNT_ID ceeb3e88-70e5-4652-8ec1-e8184837effb.333bcd16-df0a-455c-851c-7c9aae8b68f9
ENV TENANT_ID 333bcd16-df0a-455c-851c-7c9aae8b68f9
ENV CLIENT_ID 51ac598c-f346-4537-b546-f601141b55fe

RUN a2dissite 000-default.conf
RUN a2ensite apache-flask.conf
RUN a2enmod headers
RUN a2enmod wsgi
RUN service apache2 restart

# # Change Linux locale
# RUN apt-get install language-pack-en -y 
# RUN update-locale LANG=en_US.UTF-8
# RUN systemctl set-environment LANG=en_US.UTF-8
# RUN systemctl show-environment

# RUN timedatectl set-timezone 'Africa/Nairobi' \
#     && timedatectl

# LINK apache config to docker logs.
RUN ln -sf /proc/self/fd/1 /var/log/apache2/access.log && \
    ln -sf /proc/self/fd/1 /var/log/apache2/error.log

EXPOSE 80

WORKDIR /var/www/apache-flask

CMD  chown -R www-data /var/www/apache-flask && /usr/sbin/apache2ctl -D FOREGROUND
