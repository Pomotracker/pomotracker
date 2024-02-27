# Use the official Golang image as the base image
FROM golang:1.21.5


WORKDIR /app

COPY go.mod ./
COPY go.sum ./

COPY . ./

RUN go build -o /main ./cmd/api

EXPOSE 8080

CMD [ "/main"]