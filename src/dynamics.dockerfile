FROM mcr.microsoft.com/dotnet/sdk:8.0 AS net-builder
ARG CSPROJ_NAME="Spd.Presentation.Dynamics/Spd.Presentation.Dynamics.csproj"

# install diagnostics tools
RUN mkdir /tools
RUN dotnet tool install --tool-path /tools dotnet-trace
RUN dotnet tool install --tool-path /tools dotnet-counters
RUN dotnet tool install --tool-path /tools dotnet-dump

WORKDIR /src
# Copy the main source project files
# COPY ["Spd.sln", ".editorconfig", "Directory.Build.props", "Directory.Packages.props", "global.json", "./"]
COPY ["Spd.sln", "./"]
COPY */*.csproj ./
COPY */*/*.csproj ./

RUN list="$(ls ./)" && echo $list

RUN cat Spd.sln \
| grep "\.*sproj" \
| awk '{print $4}' \
| sed -e 's/[",]//g' \
| sed 's#\\#/#g' \
| xargs -I % sh -c 'mkdir -p $(dirname %) && mv $(basename %) $(dirname %)/'

RUN dotnet restore ${CSPROJ_NAME}
COPY . .
RUN dotnet publish ${CSPROJ_NAME} -c Release -o /app/publish --no-restore

FROM registry.access.redhat.com/ubi8/dotnet-80-runtime:8.0 AS final

# copy diagnostics tools
WORKDIR /tools
COPY --from=net-builder /tools .

# copy app
WORKDIR /app
COPY --from=net-builder /app/publish .
ENTRYPOINT ["dotnet", "Spd.Presentation.Dynamics.dll"]