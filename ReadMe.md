
# TRPC Demo

This a quick demo i drummed up using [trpc-openapi](https://github.com/jlalmes/trpc-openapi).
## Tech Stack

**Client:** React, TailwindCSS

**Server:** Node, Express, trpc-openapi, prisma


## Differences

1. Our current tech stack uses express and GO. Then in the client side we have a wrapper around react-query for the api fetches. 
- Difference: This current stack is also in express, and uses trpc-openapi to wire up the backend. The client side still uses react-query (tanstack) but it's wrapped around trpc.
- Cause: I want to try out trpc in a microservice environment and see how it compares to our current stack.
- Pros: 
  - The openapi integration is really nice. It's easy to generate the client side code and it's easy to use. 
  - The trpc integration with react-query is really nice. It's easy to use and it's easy to understand.
  - DX is really nice. It's easy to get started and it's easy to understand.
- Cons:
  - Problem with openAPI
    - Uses a different protocol which is [JSON-RPC](https://www.jsonrpc.org/specification).
    - I'm not sure how to add descriptions to inputs and outputs.
    - api gateway is really weird.

2. This uses the [JSON-RPC 2.0](https://www.jsonrpc.org/specification) spec. So success cases are 200s, and errors are modeled a certain way.
- no way around this

3. This could be a limitation to me, but couldn't figure out how to do the Swagger docs in the gateway level
- there could potentially be a package out there to solve this. parsing the OpenAPI specs and printing out a yaml



## Authors

- [@joshua santos](https://www.github.com/mrnicericee)

