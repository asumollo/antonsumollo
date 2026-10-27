// What /api/ask streams to the Ask drawer, one JSON object per line. Shared by the route and the
// drawer, so it must stay free of server-only imports.

export type AskEvent =
  /** A piece of the model's reply. Consecutive pieces join into one paragraph. */
  | { type: "text"; delta: string }
  /** The model asked for a tool. Sent as soon as its name streams in. */
  | { type: "step"; id: string; name: string; status: "running" }
  /**
   * The tool ran. `summary` is the short result printed after its name, `args` what it was called
   * with, like `slug: "invoice-inbox"`. `preview` is the first lines of the raw text the model got,
   * and `more` how many lines were left out, so any kind of result shows the same way.
   */
  | { type: "step"; id: string; name: string; status: "done"; summary: string; args: string; preview: string[]; more: number };
