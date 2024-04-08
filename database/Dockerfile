FROM mariadb:10.4.12

COPY ./skill_shuffle.sql /docker-entrypoint-initdb.d/skill_shuffle.sql

EXPOSE 3306
CMD ["mysqld"]

# FROM mariadb:10.4.22
# COPY ./skill_shuffle.sql /docker-entrypoint-initdb.d/