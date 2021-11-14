FROM golang:1.17.3-alpine

RUN apk add git
RUN apk add --update gcc musl-dev

# Set destination for COPY
WORKDIR /gongtenk

# Download Go modules
COPY go.mod .
COPY go.sum .

# sequence go mod download to have different layers
RUN go mod download

# Copy the source code. Note the slash at the end, as explained in
# https://docs.docker.com/engine/reference/builder/#copy
ADD go go
ADD ng/dist/ng ng/dist/ng
COPY embed.go ./

# Build
RUN go get
WORKDIR /gongtenk/go/cmd/gongtenk
RUN go build

# This is for documentation purposes only.
# To actually open the port, runtime parameters
# must be supplied to the docker command.
EXPOSE 8080

# (Optional) environment variable that our dockerised
# application can make use of. The value of environment
# variables can also be set via parameters supplied
# to the docker command on the command line.
#ENV HTTP_PORT=8081

# Run
CMD [ "/gongtenk/go/cmd/gongtenk/gongtenk" ]
