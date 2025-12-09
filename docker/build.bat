docker buildx build --progress=plain --build-arg LLONEBOT_VERSION=7.0.0 --platform linux/amd64,linux/arm64 -t linyuchen/llonebot:7.0.0 -f docker/Dockerfile .
