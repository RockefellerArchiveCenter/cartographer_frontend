# cartographer_frontend

A React application which provides a user-facing frontend to manage JSON tree representations of all archival collections, sub-collections, and parts (record group, subgroup, series, subseries, etc.) by a designated agent/creator ("arrangement maps" for short).

cartographer_frontend is part of [Project Electron](https://github.com/RockefellerArchiveCenter/project_electron), an initiative to build sustainable, open and user-centered infrastructure for the archival management of digital records at the [Rockefeller Archive Center](http://rockarch.org/).

[![Build Status](https://travis-ci.org/RockefellerArchiveCenter/cartographer_frontend.svg?branch=master)](https://travis-ci.org/RockefellerArchiveCenter/cartographer_frontend)

## Local Development

Install [git](https://git-scm.com/) and clone the repository

    $ git clone https://github.com/RockefellerArchiveCenter/cartographer_frontend.git

With [Docker](https://store.docker.com/search?type=edition&offering=community) installed, run docker-compose from the root directory

    $ docker-compose up

Once the application starts successfully, you should be able to access the application in your browser at `http://localhost:8000`

When you're done, shut down docker-compose

    $ docker-compose down

Or, if you want to remove all data

    $ docker-compose down -v


## Docker Image

Every time a commit is pushed to GitHub in the master branch, this repository builds a [Docker image](https://hub.docker.com/repository/docker/rockarch/cartographer_frontend) in Docker Hub.


## License

This code is released under an [MIT License](LICENSE).
