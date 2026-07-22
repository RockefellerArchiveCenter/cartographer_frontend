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


## Accessibility

The drag and drop interface for arrangement maps (built using [`nosferatu500/react-sortable-tree`](https://github.com/nosferatu500/react-sortable-tree)) has significant accessibility issues related to WCAG 2.2 AA success criteria 1.3.1 Info and Relationships, 2.1.1 Keyboard, 2.5.7 Dragging Movements, and 4.1.2 Name, Role, Value:
- The drag-and-drop interface does not support keyboard-only interactions; arrangement map components cannot be moved via the keyboard.
- The hierarchy between parent and child map components is only conveyed visually, and therefore does not convey structure, hierarchy, or the full context to screen readers.

We have opted to use this library despite these issues because it is the only one we can find that supports dragging and dropping in a multi-level tree. If you know of a more accessible option, please file an issue or get in touch!


## License

This code is released under an [MIT License](LICENSE).
