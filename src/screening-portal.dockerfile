FROM mcr.microsoft.com/dotnet/sdk:7.0 AS net-builder

# install diagnostics tools
RUN mkdir /tools
RUN dotnet tool install --tool-path /tools dotnet-trace
RUN dotnet tool install --tool-path /tools dotnet-counters
RUN dotnet tool install --tool-path /tools dotnet-dump

WORKDIR /src
COPY ["Spd.Presentation.Screening/Spd.Presentation.Screening.csproj", "Spd.Presentation.Screening/"]
RUN dotnet restore "Spd.Presentation.Screening/Spd.Presentation.Screening.csproj"
COPY . .
RUN dotnet publish "Spd.Presentation.Screening/Spd.Presentation.Screening.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM docker.io/trion/ng-cli-karma AS ng-builder
WORKDIR /src
COPY ./Spd.Presentation.Screening/ClientApp/package*.json ./
RUN npm install --ignore-scripts
COPY ./Spd.Presentation.Screening/ClientApp/ .

# RUN npm run lint
# RUN npm run test -- --no-watch --no-progress
RUN npm run build -- --configuration production

# FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
FROM registry.access.redhat.com/ubi8/dotnet-70-runtime AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://*:8080
# copy diagnostics tools
WORKDIR /tools
COPY --from=net-builder /tools .
# copy app
WORKDIR /app
COPY --from=net-builder /app/publish .
COPY --from=ng-builder /src/dist/ ./wwwroot
ENTRYPOINT ["dotnet", "Spd.Presentation.Screening.dll"]