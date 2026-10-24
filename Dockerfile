# Multi-stage Docker build for C++ Student Ranking BST Server
# Stage 1: Build binary using GCC
FROM debian:bookworm-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    g++ \
    make \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY backend/server.cpp .

# Compile optimized C++ binary
RUN g++ -O2 -std=c++14 server.cpp -o server

# Stage 2: Minimal runtime image
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app/server /app/server

# Render assigns dynamic PORT environment variable (default 8080)
ENV PORT=8080
EXPOSE 8080

CMD ["/app/server"]
