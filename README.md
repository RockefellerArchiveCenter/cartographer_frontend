# cartographer_frontend

A React application which provides a user-facing frontend to manage JSON tree representations of all archival collections, sub-collections, and parts (record group, subgroup, series, subseries, etc.) by a designated agent/creator ("arrangement maps" for short).

cartographer_frontend is part of [Project Electron](https://github.com/RockefellerArchiveCenter/project_electron), an initiative to build sustainable, open and user-centered infrastructure for the archival management of digital records at the [Rockefeller Archive Center](http://rockarch.org/).

[![Build Status](https://travis-ci.org/RockefellerArchiveCenter/cartographer_frontend.svg?branch=base)](https://travis-ci.org/RockefellerArchiveCenter/cartographer_frontend)

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


## Accessibility

The drag and drop interface for arrangement maps (built using [`react-sortable-tree`](https://github.com/frontend-collective/react-sortable-tree)) has a number of accessibility issues:
- The interface does not fully support keyboard-only interactions, as arrangement map components cannot be moved via the keyboard.
- Screen readers are not able to effectively read the element:
  - An aria-label with a value of "grid" is applied to the top-level element containing the draggable tree.
  - The draggable tree is seen aas a table with 0 columns and 0 rows.
  - The title and text of arrangement map components could not be read.
  - Buttons are not associated with the component they are related to.

We have opted to use this library despite these issues because it is the only one we can find which supports dragging and dropping in a multi-level tree. If you know of a more accessible option, please file an issue or get in touch!


## License

This code is released under an [MIT License](LICENSE).
