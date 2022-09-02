# Working modes

Server can work in the following modes:

1. `record`. Server proxies requests to the `targetUrl` and saves responses to file.
1. `replayOrRecord`. Server reads response from file. If there are no matching files, goes to `targetUrl` and saves response.
2. `replay`. Server reads response from file. If there are no matching files, 404 error.
3. `replayOrProxy`. Server reads response from file. If there are no matching files, go to `targetUrl`.
4. `proxy`. Server just proxies to the `targetUrl`

Mode is determined by:
1. `mode` param to mockProxy middleware
2. Using middleware `mockProxyConfig` (must be defined before `mockProxy` middleware)
3. Using environment variable `KOA_MOCK_PROXY_MODE`
