FROM mcr.microsoft.com/dotnet/sdk:7.0

WORKDIR /vsdbg

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    unzip \
    && rm -rf /var/lib/apt/lists/* \
    && curl -sSL https://aka.ms/getvsdbgsh \
    | bash /dev/stdin -v latest -l /vsdbg

RUN dotnet tool install --global dotnet-ef
ENV PATH="${PATH}:/root/.dotnet/tools"

ENV DOTNET_USE_POLLING_FILE_WATCHER 1

WORKDIR /app

ENTRYPOINT dotnet watch run --urls=http://+:5000
