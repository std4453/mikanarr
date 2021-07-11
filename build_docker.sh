#!/bin/bash
yarn --frozen-lockfile
yarn build
docker build . -t std4453/mikanarr
