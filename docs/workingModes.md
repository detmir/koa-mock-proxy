# Working modes

Server can work in the following modes:

1. `record`. Server proxy requests to the `targetUrl` and save responses to file.
2. `replay`. Server read response from file. If there are no matching file, 404 error.
3. `replayOrProxy`. Server read response from file. If there are no matching file, go to `targetUrl`.
4. `proxy`. Server just proxy to the `targetUrl`

Mode is determined by:
1. `mode` param to mockProxy middleware
2. Using middleware `mockProxyConfig` (must be defined before `mockProxy` middleware)
3. Using environment variable `KOA_MOCK_PROXY_MODE`
