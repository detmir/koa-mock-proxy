interface ApiRequestParams {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "SEARCH";
  params?: unknown;
}

export const apiRequest = async ({
  url,
  params,
  ...restParams
}: ApiRequestParams) => {
  const method = restParams.method ?? "GET";

  const needRequestBody = method !== "GET" && Boolean(params);
  const needQueryParams = method === "GET" && Boolean(params);

  const headers = {};

  if (needRequestBody) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(
    `api/${url}${
      needQueryParams
        ? `?${new URLSearchParams(params as Record<string, string>)}`
        : ""
    }`,
    {
      method: method ?? "GET",
      headers,
      body: needRequestBody ? JSON.stringify(params) : undefined,
    }
  );

  return response.json();
};
