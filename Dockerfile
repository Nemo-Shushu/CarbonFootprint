FROM postgres:17
RUN rm -f /docker-entrypoint-initdb.d/*
COPY carbon_foot_dump.sql /docker-entrypoint-initdb.d/