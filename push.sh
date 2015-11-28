#!/bin/bash
docker tag dundee-data-day:latest cizer/dundee-data-day:$1
docker push cizer/dundee-data-day:$1