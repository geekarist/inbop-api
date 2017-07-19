#!/bin/sh
test -e secret/google-env.sh && . secret/google-env.sh
node index.js
