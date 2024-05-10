# Skill Shuffle

<img src=".github/logo.svg" width="400" alt="skill-shuffle">

## Description

The goal of this project is to create a web-based information platform in the form of a social network for communication that brings people together based on common interests, activities or connections, exchange of experiences and joint learning.

## Technologies

- Spring Boot
- React.js
- Bootstrap
- Mariadb
- Docker

## Installation Instructions

### Download

```bash
git clone -b master https://github.com/mak7ilenin/Skill-Shuffle.git
```

### Run with Docker

### Install Docker

#### If you don't have a Docker on your machine, then you need to install Docker. Here is the links to the official Docker website:

- #### Windows

  [Download and install Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)

- #### Linux

  [Download and install Docker Engine for Linux](https://docs.docker.com/desktop/install/linux-install/)

- #### Mac
  [Download and install Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)

#### Build

```bash
cd Skill-Shuffle
docker-compose build
```

#### Run

```bash
docker-compose up
```

### Run without Docker

#### Backend

```bash
cd Skill-Shuffle/server
gradlew bootRun
```

#### Frontend

```bash
cd Skill-Shuffle/client
npm install
npm start
```

#### Database

Import .sql dump from /database to the phpMyAdmin or any other database management tool.

## Features

- Registration
- Login
- Logout
- Search for users
- Messenger based on WebSocket
- Manage group chats
- Add new chat
- User profile
- User privacy settings
- Feeds
- Add new post

## Credentials

### Test user 1

- Login: test
- Password: 123

### Test user 2

- Login: test1
- Password: 123

## Authors

- [Maksim Dzjubenko](https://github.com/mak7ilenin)
- [Maksim Grišin](https://github.com/9I6JloKo)
