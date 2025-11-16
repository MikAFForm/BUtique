/* eslint-disable import/no-unresolved */
"use client";

import { useCallback, useState } from "react";

const DEFAULT_QUERY = `query GetUsers {
  users {
    id
    name
    email
  }
}`;

const TEMPLATES: Record<"query" | "mutation", string> = {
  query: DEFAULT_QUERY,
  mutation: `mutation CreateUser($name: String!, $email: String!) {
  createUser(name: $name, email: $email) {
    id
    name
    email
  }
}`,
};

export default function GraphiQLPage() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [variablesText, setVariablesText] = useState("{}");
  const [result, setResult] = useState<string>("{}");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<"query" | "mutation">(
    "query"
  );
  const [copied, setCopied] = useState(false);

  const applyTemplate = useCallback((kind: "query" | "mutation") => {
    setActiveTemplate(kind);
    setQuery(TEMPLATES[kind]);
    setVariablesText(
      kind === "mutation"
        ? JSON.stringify({ name: "New User", email: "user@example.com" }, null, 2)
        : "{}"
    );
  }, []);

  const copyResult = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Failed to copy result to clipboard.");
    }
  }, [result]);

  const runQuery = useCallback(async () => {
    setLoading(true);
    setError(null);

    let variables: Record<string, unknown> = {};
    if (variablesText.trim().length > 0) {
      try {
        variables = JSON.parse(variablesText);
      } catch (err) {
        setError("Variables must be valid JSON.");
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [query, variablesText]);

  return (
    <div className="flex min-h-screen flex-col gap-8 bg-slate-50 p-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          GraphQL Playground
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Use this page to run queries and mutations against <code>/api/graphql</code>.
          Pick a template, tweak it, optionally provide JSON variables, then click
          <strong> Run</strong> to see the response.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Templates</p>
            <p className="text-xs text-slate-500">
              Load a ready-made operation into the editor to get started.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => applyTemplate("query")}
              className={`rounded px-3 py-1 text-sm font-medium ${
                activeTemplate === "query"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              Query Example
            </button>
            <button
              type="button"
              onClick={() => applyTemplate("mutation")}
              className={`rounded px-3 py-1 text-sm font-medium ${
                activeTemplate === "mutation"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              Mutation Example
            </button>
          </div>
        </div>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-700">
          Operation (Query or Mutation)
        </span>
        <textarea
          className="h-56 rounded border border-slate-300 bg-white p-3 font-mono text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-700">
          Variables (JSON)
        </span>
        <textarea
          className="h-32 rounded border border-slate-300 bg-white p-3 font-mono text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring"
          value={variablesText}
          onChange={(event) => setVariablesText(event.target.value)}
        />
      </label>

      <button
        type="button"
        onClick={runQuery}
        disabled={loading}
        className="w-32 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {loading ? "Running..." : "Run"}
      </button>

      {error && (
        <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <label className="flex flex-col gap-2">
        <span className="flex items-center justify-between text-sm font-medium text-slate-700">
          Result
          <button
            type="button"
            onClick={copyResult}
            className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
          >
            {copied ? "Copied!" : "Copy JSON"}
          </button>
        </span>
        <textarea
          className="h-64 rounded border border-slate-300 bg-slate-900 p-3 font-mono text-sm text-green-200 shadow-inner"
          value={result}
          readOnly
        />
      </label>
    </div>
  );
}
