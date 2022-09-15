#!/usr/bin/env bash
ncu -u
# npm install --no-optional
rm -rf package-lock.json
npm cache verify
npm install
