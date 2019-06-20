little-program-api



ruby:2.1



ztGHphyvXCex-WbXxaP-

\# image: docker:latest

\# stages:

\#   - Build image

\# docker build:

\#   stage: Build image

\#   script:

\#     - docker build -t first:v0.0.1 .

node:latest

/etc/gitlab-runner/config.toml

ztGHphyvXCex-WbXxaP-

苏州乐栈公寓

8bb01c0f9e5b

docker run -d -p 8080:8080 api:v3 npm start

docker run -t -i api:v3 /bin/sh

docker image rm api:v3 -f

docker container ls -a