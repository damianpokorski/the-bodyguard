# Goals
Opinionated wrapper for use in microservices & function endpoints (AWS Lambdas, Azure Functions, GCP Cloud Functions, Express, Nest.js etc.) which focuses on

- Using OpenAPI as single source of truth (for both requests & responses)
    - Leverages type generation as much as possible to minimize drift between documentation and code
    - Generated files are indented for checking into repo
- Generates a fast authentication layer that's immune to cold start issues
- Can be easily plugged into custom code
- Does not impact development speed & is not disruptive (instead of adding minutes to local build times or testing)