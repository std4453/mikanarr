#!/bin/bash
yarn
yarn build
docker build . -t std4453/mikanarr
