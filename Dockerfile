FROM postgres:15
COPY carbon_foot_dump.sql /docker-entrypoint-initdb.d/