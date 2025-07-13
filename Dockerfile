# Dockerfile для point-service (backend + frontend)
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app

# Копируем backend
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ./PointService ./PointService
WORKDIR /src/PointService
RUN dotnet publish -c Release -o /app/publish

# Копируем frontend
FROM nginx:alpine AS frontend
COPY ./frontend /usr/share/nginx/html

# Финальный образ
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
COPY --from=frontend /usr/share/nginx/html ./frontend
EXPOSE 80
ENV ASPNETCORE_URLS=http://+:80

# Запуск backend и nginx (frontend)
CMD ["sh", "-c", "dotnet PointService.dll & nginx -g 'daemon off;'"] 