#!/bin/bash
set -e

for TEMPLATE in appspec.yml.deploy \
  deploy_scripts/*.deploy \
  .env.deploy
do
  if [[ -f "$TEMPLATE" ]]; then
    echo "Replacing variables in $TEMPLATE"
    envsubst < "$TEMPLATE" > `echo "$TEMPLATE" | sed -e 's/\(\.deploy\)*$//g'`
    rm $TEMPLATE
  fi
done
