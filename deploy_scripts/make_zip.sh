#!/bin/bash
set -e

ZIP_DIR=$1
ZIP_NAME=$2

if [ ! -f $ZIP_DIR/$ZIP_NAME ]; then

  # copy appspec file
  cp appspec.yml build/
  cp -r deploy_scripts/ build/
  # create zip file from build dir
  zip -r $ZIP_NAME build
  mkdir -p $ZIP_DIR
  mv $ZIP_NAME $ZIP_DIR/$ZIP_NAME

fi
