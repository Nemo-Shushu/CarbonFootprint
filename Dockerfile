FROM postgres:17
RUN rm /docker-entrypoint-initdb.d/*
COPY carbon_foot_dump.sql /docker-entrypoint-initdb.d/