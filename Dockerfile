# Build Stage - Angular
FROM node:22-alpine AS angular-build
WORKDIR /app/web
COPY src/Parsimonie.Web/package*.json ./
RUN npm ci
COPY src/Parsimonie.Web/ ./
RUN npm run build

# Build Stage - .NET
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS api-build
WORKDIR /app
COPY Parsimonie.sln ./
COPY src/Parsimonie.Api/*.csproj src/Parsimonie.Api/
RUN dotnet restore src/Parsimonie.Api/Parsimonie.Api.csproj
COPY src/Parsimonie.Api/ src/Parsimonie.Api/
RUN dotnet publish src/Parsimonie.Api/Parsimonie.Api.csproj -c Release -o /publish --no-restore

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Create non-root user for security
RUN groupadd -r parsimonie && useradd -r -g parsimonie parsimonie
USER parsimonie

# Copy API build output
COPY --from=api-build --chown=parsimonie:parsimonie /publish ./

# Copy Angular build output to wwwroot
COPY --from=angular-build --chown=parsimonie:parsimonie /app/web/dist/Parsimonie.Web/browser ./wwwroot

# Expose port
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "Parsimonie.Api.dll"]
