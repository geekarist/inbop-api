#!/bin/sh
test -e secret/facebook-env.sh && . secret/facebook-env.sh
node index.js
