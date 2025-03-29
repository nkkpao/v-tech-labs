FROM gcc AS builder
WORKDIR /app
COPY main.c .
RUN gcc -o hello main.c

FROM alpine
WORKDIR /app
COPY --from=builder /app/hello .
CMD ["./hello"]
