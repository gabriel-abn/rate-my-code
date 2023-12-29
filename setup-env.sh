#!bin/bash

mkdir src/main/config/env

cp .env src/main/config/env/.test.env
cp .env src/main/config/env/.dev.env
cp .env src/main/config/env/.prod.env
