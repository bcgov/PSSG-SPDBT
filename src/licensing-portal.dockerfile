FROM mcr.microsoft.com/dotnet/sdk:8.0 AS dotnet-builder

# install diagnostics tools
RUN mkdir /tools
RUN dotnet tool install --tool-path /tools dotnet-trace
RUN dotnet tool install --tool-path /tools dotnet-counters
RUN dotnet tool install --tool-path /tools dotnet-dump

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

RUN dotnet restore "Spd.Presentation.Licensing/Spd.Presentation.Licensing.csproj"
COPY . .
RUN dotnet publish "Spd.Presentation.Licensing/Spd.Presentation.Licensing.csproj" -c Release -o /app/publish --no-restore

FROM docker.io/trion/ng-cli-karma:latest AS ng-builder
WORKDIR /src
COPY ./Spd.Presentation.Licensing/ClientApp/package*.json ./
RUN npm install --ignore-scripts
COPY ./Spd.Presentation.Licensing/ClientApp/ .

RUN npm run lint
# RUN npm run test -- --no-watch --no-progress
RUN npm run build -- --configuration production

FROM registry.access.redhat.com/ubi8/dotnet-80-runtime:8.0 AS final
WORKDIR /app
EXPOSE 8080

# copy diagnostics tools
WORKDIR /tools
COPY --from=dotnet-builder /tools .

# copy app
WORKDIR /app
COPY --from=dotnet-builder /app/publish .
COPY --from=ng-builder /src/dist/ ./wwwroot
ENTRYPOINT ["dotnet", "Spd.Presentation.Licensing.dll"]