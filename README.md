# cartographer_frontend

A React application which provides a user-facing frontend to manage JSON tree representations of all archival collections, sub-collections, and parts (record group, subgroup, series, subseries, etc.) by a designated agent/creator ("arrangement maps" for short).

cartographer_frontend is part of [Project Electron](https://github.com/RockefellerArchiveCenter/project_electron), an initiative to build sustainable, open and user-centered infrastructure for the archival management of digital records at the [Rockefeller Archive Center](http://rockarch.org/).

## Local Development

Install [git](https://git-scm.com/) and clone the repository

    $ git clone https://github.com/RockefellerArchiveCenter/cartographer_frontend.git

Install dependencies and run the development server:

    $ yarn install
    $ yarn dev


This repository contains a configuration file for a git pre-commit hooks which help ensure that code is linted before it is checked into version control. It is strongly recommended that you install these hooks locally by running `yarn prepare`.


## License

This code is released under an [MIT License](LICENSE).
