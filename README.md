# DDD NestJS API Template

A robust and scalable NestJS API template following Domain-Driven Design (DDD) principles, clean architecture, and best practices. This template provides a solid foundation for building enterprise-grade applications with a focus on maintainability, scalability, and code quality.

## 🚀 Features

### Core Features

- **Domain-Driven Design (DDD)** architecture
  - Bounded contexts
  - Aggregates and entities
  - Value objects
  - Domain events
  - Domain services
- **Clean Architecture** implementation
  - Clear separation of concerns
  - Dependency inversion
  - Interface segregation
  - Single responsibility principle
- **TypeScript** for type safety
  - Strict type checking
  - Advanced type features
  - Enhanced IDE support

### Technical Stack

- **NestJS** framework
  - Modular architecture
  - Dependency injection
  - Middleware support
  - Guards and interceptors
- **TypeORM** for database operations
  - Entity relationships
  - Migrations
  - Query builder
  - Transactions
- **JWT Authentication**
  - Token-based authentication
  - Role-based access control
  - Refresh token mechanism
- **Swagger** API documentation
  - OpenAPI 3.0 specification
  - Interactive API explorer
  - Request/response schemas
- **Winston** logging
  - Multiple log levels
  - Log rotation
  - Custom formatters
  - Multiple transports

### Development Tools

- **Jest** testing framework
  - Unit testing
  - Integration testing
  - E2E testing
  - Code coverage
- **ESLint** & **Prettier** for code quality
  - Code style enforcement
  - Best practices checking
  - Automatic formatting
- **Docker** support
  - Development environment
  - Production deployment
  - Multi-stage builds

## 📋 Prerequisites

### Required Software

- Node.js (v20 or higher)
  - Recommended: v20 LTS
  - NPM or Yarn package manager
- MySQL database
  - Version 8.0 or higher
  - InnoDB engine
- Docker (optional)
  - Docker Engine 20.10+
  - Docker Compose 2.0+

### Development Environment

- Git for version control
- VS Code (recommended) or your preferred IDE
- Postman or similar API testing tool
- MySQL Workbench or similar database management tool

## 🛠 Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd ddd-nest-api
```

2. Install dependencies:

```bash
yarn install
```

3. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

4. Update the environment variables in `.env` file with your configuration:

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=ddd_nest_api

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1d
JWT_REFRESH_EXPIRATION=7d

# Logging
LOG_LEVEL=debug
LOG_DIR=logs
```

5. Start the development server:

```bash
yarn start:dev
```

## 🏗 Project Structure

```
src/
├── modules/                    # Domain modules
│   └── [module-name]/         # Example: users, products, orders
│       ├── application/       # Application services
│       │   ├── commands/      # Command handlers
│       │   ├── queries/       # Query handlers
│       │   └── dtos/         # Data Transfer Objects
│       ├── domain/           # Domain layer
│       │   ├── entities/     # Domain entities
│       │   ├── interfaces/   # Repository interfaces
│       │   ├── value-objects/# Value objects
│       │   └── events/       # Domain events
│       └── infrastructure/   # Infrastructure implementations
│           ├── controllers/  # API controllers
│           ├── repositories/ # Repository implementations
│           └── services/     # External service implementations
├── shared/                   # Shared utilities and constants
│   ├── decorators/          # Custom decorators
│   ├── filters/             # Exception filters
│   ├── guards/              # Authentication guards
│   ├── interceptors/        # Request/response interceptors
│   └── utils/               # Utility functions
├── infra/                   # Infrastructure configurations
│   ├── config/              # Configuration files
│   ├── database/            # Database configuration
│   └── logging/             # Logging configuration
└── main.ts                  # Application entry point
```

## 🚀 Running the Application

### Development

```bash
# Start development server with hot-reload
yarn start:dev

# Start with debug mode
yarn start:debug

# Start with SWC compiler (faster)
yarn start:swc
```

### Production

```bash
# Build the application
yarn build

# Start production server
yarn start:prod
```

### Docker

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## 📝 API Documentation

### Swagger UI

Once the application is running, access the Swagger documentation at:

```
http://localhost:3000/api
```

### API Versioning

The API supports versioning through the URL path:

```
http://localhost:3000/api/v1/[resource]
```

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🧪 Testing

### Unit Tests

```bash
# Run all unit tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:cov
```

### E2E Tests

```bash
# Run all e2e tests
yarn test:e2e

# Run specific e2e test file
yarn test:e2e --testPathPattern=auth.e2e-spec.ts
```

### Test Structure

```
test/
├── unit/              # Unit tests
├── integration/       # Integration tests
└── e2e/              # End-to-end tests
```

## 📦 Database Migrations

### Creating Migrations

```bash
# Create a new migration
yarn migration:create src/infra/database/migrations/CreateUsersTable

# Example migration content
export class CreateUsersTable implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
        );
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }
}
```

### Running Migrations

```bash
# Run all pending migrations
yarn migration:run

# Revert last migration
yarn migration:revert

# Run seeders
yarn seed:run
```

## 🔧 Code Quality

### Linting

```bash
# Run linter
yarn lint

# Fix linting issues automatically
yarn lint --fix
```

### Formatting

```bash
# Format code
yarn format
```

### Pre-commit Hooks

The project includes pre-commit hooks for:

- Linting
- Formatting
- Type checking
- Test running

## 📚 Architecture

### Domain Layer

- Contains business logic and entities
- Independent of other layers
- Defines interfaces for repositories
- Implements domain events

### Application Layer

- Orchestrates domain objects
- Implements use cases
- Handles transactions
- Manages application events

### Infrastructure Layer

- Implements repository interfaces
- Handles external services
- Manages database connections
- Implements security features

### Presentation Layer

- Handles HTTP requests/responses
- Implements API versioning
- Manages authentication
- Formats responses

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch:

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes:

```bash
git commit -m 'Add some amazing feature'
```

4. Push to the branch:

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

### Commit Message Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:

- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- hs.weird

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- TypeORM team for the database ORM
- All contributors who have helped shape this template

## 📞 Support

For support, please:

1. Check the [documentation](docs/)
2. Search [existing issues](issues)
3. Create a new issue if needed

## 🔄 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.
