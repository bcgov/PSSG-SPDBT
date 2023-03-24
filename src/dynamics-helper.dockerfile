FROM mcr.microsoft.com/dotnet/sdk:7.0 AS net-builder

# install diagnostics tools
RUN mkdir /tools
RUN dotnet tool install --tool-path /tools dotnet-trace
RUN dotnet tool install --tool-path /tools dotnet-counters
RUN dotnet tool install --tool-path /tools dotnet-dump

WORKDIR /src
COPY ["Spd.DynamicsHelper/Spd.DynamicsHelper.csproj", "Spd.DynamicsHelper/"]
RUN dotnet restore "Spd.DynamicsHelper/Spd.DynamicsHelper.csproj"
COPY . .
RUN dotnet publish "Spd.DynamicsHelper/Spd.DynamicsHelper.csproj" -c Release -o /app/publish /p:UseAppHost=false

# FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
FROM registry.access.redhat.com/ubi8/dotnet-70-runtime AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://*:8080
ENV ASPNETCORE_ENVIRONMENT Development
# copy diagnostics tools
WORKDIR /tools
COPY --from=net-builder /tools .
# copy app
WORKDIR /app
COPY --from=net-builder /app/publish .
ENTRYPOINT ["dotnet", "Spd.DynamicsHelper.dll"]