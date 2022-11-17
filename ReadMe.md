
# TRPC Demo

This a quick demo i drummed up using [trpc-openapi](https://github.com/jlalmes/trpc-openapi).
## Tech Stack

**Client:** React, TailwindCSS

**Server:** Node, Express, trpc-openapi, prisma


## Differences

1. Our current tech stack uses express and this is a general wrapper around express.
- could potentially just do a base node server


2. This uses the [JSON-RPC 2.0](https://www.jsonrpc.org/specification) spec. So success cases are 200s, and errors are modeled a certain way.
- no way around this

3. This could be a limitation to me, but couldn't figure out how to do the Swagger docs in the gateway level
- there could potentially be a package out there to solve this. parsing the OpenAPI specs and printing out a yaml



## Authors

- [@joshua santos](https://www.github.com/mrnicericee)

