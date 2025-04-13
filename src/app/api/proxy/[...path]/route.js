import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  return handleProxy(req, params);
}

export async function POST(req, { params }) {
  return handleProxy(req, params);
}

export async function PUT(req, { params }) {
  return handleProxy(req, params);
}

export async function DELETE(req, { params }) {
  return handleProxy(req, params);
}

export async function PATCH(req, { params }) {
  return handleProxy(req, params);
}

async function handleProxy(req, params) {
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Base URL of the actual backend
  const targetPath = params.path.join("/"); // Join the path parameters to form the target URL
  const targetUrl = `${backendUrl}/${targetPath}`;

  const headers = new Headers(req.headers);
  headers.set("host", new URL(backendUrl).host); // Set the host header to match the backend
  headers.set("accept-encoding", "identity"); // Set to prevent transfer encoding issues
  headers.delete("content-length"); // Remove content-length as it will be set automatically by fetch

  const fetchOptions = {
    method: req.method,
    headers,
    credentials: "include", // Include credentials (cookies) in the request
    body:
      req.method !== "GET" && req.method !== "HEAD"
        ? await req.text()
        : undefined,
  };

  const response = await fetch(targetUrl, fetchOptions); // Proxy the request to the backend
  const resBody = await response.text(); // Get the response body from the backend

  const proxyResponse = new NextResponse(resBody, {
    status: response.status,
    headers: response.headers, // Forward the response headers from the backend
  });

  // Forward cookies from the backend (if any) to the client
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    proxyResponse.headers.set("set-cookie", setCookie);
  }

  return proxyResponse;
}
