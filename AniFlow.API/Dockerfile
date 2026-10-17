FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["AniFlow.API/AniFlow.API.csproj", "AniFlow.API/"]
RUN dotnet restore "./AniFlow.API/AniFlow.API.csproj"
COPY . .
WORKDIR "/src/AniFlow.API"
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./AniFlow.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENV ASPNETCORE_URLS=http://+:5000

ENTRYPOINT ["dotnet", "AniFlow.API.dll"]