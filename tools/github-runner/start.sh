#!/bin/bash

ORGANIZATION=$ORGANIZATION
ACCESS_TOKEN=$ACCESS_TOKEN
AGENT_NAME=$NAME

cd /home/runner/actions-runner

./config.sh --url https://github.com/${ORGANIZATION} --token ${ACCESS_TOKEN} --name ${AGENT_NAME} --unattended

cleanup() {
    echo "Removing runner..."
    ./config.sh remove --token ${ACCESS_TOKEN}
}

trap 'cleanup; exit 130' INT
trap 'cleanup; exit 143' TERM

./run.sh & wait $!