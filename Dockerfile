FROM postgres:17
COPY carbon_foot_dump.sql /docker-entrypoint-initdb.d/