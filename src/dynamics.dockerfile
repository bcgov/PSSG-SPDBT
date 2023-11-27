FROM mcr.microsoft.com/dotnet/sdk:8.0 AS net-builder

# install diagnostics tools
RUN mkdir /tools
RUN dotnet tool install --tool-path /tools dotnet-trace
RUN dotnet tool install --tool-path /tools dotnet-counters
RUN dotnet tool install --tool-path /tools dotnet-dump

WORKDIR /src
COPY ["Spd.Presentation.Dynamics/Spd.Presentation.Dynamics.csproj", "Spd.Presentation.Dynamics/"]
RUN dotnet restore "Spd.Presentation.Dynamics/Spd.Presentation.Dynamics.csproj"
COPY . .
RUN dotnet publish "Spd.Presentation.Dynamics/Spd.Presentation.Dynamics.csproj" -c Release -o /app/publish /p:UseAppHost=false

# FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
FROM registry.access.redhat.com/ubi8/dotnet-80-runtime AS final
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
ENTRYPOINT ["dotnet", "Spd.Presentation.Dynamics.dll"]