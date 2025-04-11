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
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const targetPath = params.path.join("/");
  const targetUrl = `${backendUrl}/${targetPath}`;

  const headers = new Headers(req.headers);
  headers.set("host", new URL(backendUrl).host);
  headers.set("accept-encoding", "identity");
  headers.delete("content-length");

  const fetchOptions = {
    method: req.method,
    headers,
    credentials: "include",
    body:
      req.method !== "GET" && req.method !== "HEAD"
        ? await req.text()
        : undefined,
  };

  const response = await fetch(targetUrl, fetchOptions);
  const resBody = await response.text();

  const proxyResponse = new NextResponse(resBody, {
    status: response.status,
    headers: response.headers,
  });

  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    proxyResponse.headers.set("set-cookie", setCookie);
  }

  return proxyResponse;
}
