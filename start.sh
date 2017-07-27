#!/bin/sh
test -e secret/google-env.sh && . secret/google-env.sh
test -e secret/facebook-env.sh && . secret/facebook-env.sh
node index.js
