FROM mcr.microsoft.com/dotnet/sdk:8.0 AS dotnet-builder

# Update the package list and install required dependencies
RUN apt-get update && apt-get install -y \
    libfontconfig1 \
    libfreetype6 \
    libpng16-16 \
    libx11-6 \
    libxext6 \
    libxrender1 \
    libxrandr2 \
    libglib2.0-0 \
    && apt-get clean

# install diagnostics tools
RUN mkdir /tools && \
    dotnet tool install --tool-path /tools dotnet-trace && \
    dotnet tool install --tool-path /tools dotnet-counters && \
    dotnet tool install --tool-path /tools dotnet-dump

WORKDIR /src

# Copy the main source project files
COPY ["Spd.sln", "global.json", "Directory.Build.props", "Directory.Packages.props", ".editorconfig", "./"]
COPY */*.csproj ./

RUN cat Spd.sln \
| grep "\.*sproj" \
| awk '{print $4}' \
| sed -e 's/[",]//g' \
| sed 's#\\#/#g' \
| xargs -I % sh -c 'mkdir -p $(dirname %) && mv $(basename %) $(dirname %)/'

RUN dotnet restore "Spd.Presentation.Dynamics/Spd.Presentation.Dynamics.csproj" -r linux-x64 -p:PublishReadyToRun=true
COPY . .
RUN dotnet publish "Spd.Presentation.Dynamics/Spd.Presentation.Dynamics.csproj" -c Release -o /app/publish --no-restore --self-contained true -r linux-x64 -p:PublishReadyToRun=true

FROM registry.access.redhat.com/ubi8/dotnet-80-runtime:8.0 AS final
ARG VERSION
ENV VERSION=$VERSION

WORKDIR /app
EXPOSE 8080

# copy diagnostics tools
WORKDIR /tools
COPY --from=dotnet-builder /tools .

# copy app
WORKDIR /app
COPY --from=dotnet-builder /app/publish .
ENTRYPOINT ["dotnet", "Spd.Presentation.Dynamics.dll"]