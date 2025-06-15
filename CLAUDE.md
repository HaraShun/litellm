# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development Setup
```bash
# Install development dependencies
poetry install --with dev,proxy-dev --extras proxy

# Format code
make format

# Run all linting (Ruff, MyPy, Black, circular imports)
make lint

# Run tests
make test                  # All tests
make test-unit            # Unit tests only  
make test-integration     # Integration tests only
```

### Running the Proxy Server
```bash
# Start proxy with config file
litellm --config path/to/config.yaml

# Start with specific model
litellm --model huggingface/bigcode/starcoder

# Start with debug logging
litellm --debug

# Health check all models
litellm --health

# Test the proxy
litellm --test
```

### Database & Docker
```bash
# Start local development stack
docker-compose up

# Database URL for local development
postgresql://llmproxy:dbpassword9090@localhost:5432/litellm

# Run database migrations
python litellm/proxy/prisma_migration.py
```

### Testing Specific Areas
```bash
# Test specific functionality
poetry run pytest tests/local_testing -k "langfuse"
poetry run pytest tests/local_testing -k "caching or cache"
poetry run pytest tests/local_testing -k "router"

# Run tests in parallel
poetry run pytest tests/test_litellm -x -vv -n 4
```

## Architecture Overview

### Core Components
- **`litellm/`** - Core SDK providing unified API across 100+ LLM providers
- **`litellm/proxy/`** - FastAPI-based gateway server with auth, rate limiting, budgets
- **`litellm/router.py`** - Load balancing and failover logic between model deployments
- **`ui/litellm-dashboard/`** - Next.js admin interface for proxy management
- **`litellm/llms/`** - Provider-specific implementations (OpenAI, Anthropic, Azure, etc.)

### Key Design Patterns

**Provider Abstraction**: All providers implement the same interface through transformation classes
- Request transformation: LiteLLM format → Provider format
- Response transformation: Provider response → Standardized `ModelResponse`
- Error mapping: Provider errors → LiteLLM exceptions

**Router Pattern**: Load balancing strategies (least busy, lowest cost, lowest latency) with circuit breaker pattern for fault tolerance

**Multi-layered Authentication**: API keys, JWT, OAuth2, with RBAC for users/teams/organizations

**Caching Strategy**: Multi-tier caching (local, Redis, S3) with semantic similarity caching

### Provider Implementation Structure
```
litellm/llms/provider_name/
├── chat/
│   ├── handler.py          # Request/response processing
│   └── transformation.py   # Format conversion logic
├── common_utils.py         # Provider utilities
└── cost_calculator.py      # Pricing calculations
```

## Adding New Functionality

### Adding a New LLM Provider
1. Create provider directory in `litellm/llms/`
2. Implement transformation classes inheriting from `BaseConfig`
3. Add provider to model registry in `litellm/__init__.py`
4. Handle authentication and error mapping patterns

### Adding Custom Authentication
1. Implement function following `UserAPIKeyAuth` return format
2. Register in proxy configuration
3. Follow existing auth middleware patterns in `litellm/proxy/auth/`

### Adding Observability/Logging
1. Implement `CustomLogger` interface
2. Register in callbacks list
3. Handle async logging patterns used throughout codebase

## Important Environment Variables
```bash
export LITELLM_MODE=DEV              # Development mode
export DATABASE_URL="postgresql://..." # Database connection
export DEBUG=True                    # Enable debug logging
export DETAILED_DEBUG=True           # Verbose debugging
```

## Testing Conventions
- Unit tests in `tests/test_litellm/`
- Integration tests in `tests/local_testing/`
- Use pytest with markers for categorizing tests
- Mock external provider calls in unit tests
- Integration tests require actual API keys for providers

## Code Quality Standards
- Black formatting (enforced by CI)
- Ruff linting for code quality
- MyPy type checking
- No circular imports (checked automatically)
- Comprehensive test coverage expected for new features