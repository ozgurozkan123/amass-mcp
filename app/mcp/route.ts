import { createMcpHandler } from "mcp-handler";
import { z } from "zod";

const handler = createMcpHandler(
  async (server) => {
    server.tool(
      "amass",
      "Advanced subdomain reconnaissance (returns the amass command to run locally).",
      {
        subcommand: z
          .enum(["enum", "intel"])
          .describe(
            "Specify Amass operation mode: 'intel' gathers intelligence; 'enum' performs subdomain enumeration."
          ),
        domain: z
          .string()
          .optional()
          .describe(
            "Target domain (e.g., example.com). Required for enum; optional for intel."
          ),
        intel_whois: z
          .boolean()
          .optional()
          .describe("Include WHOIS data during intelligence gathering."),
        intel_organization: z
          .string()
          .optional()
          .describe(
            "Organization name to search for during intelligence gathering (e.g., 'Example Corp')."
          ),
        enum_type: z
          .enum(["active", "passive"])
          .optional()
          .describe(
            "Enumeration approach: active performs DNS resolution; passive only uses third-party sources."
          ),
        enum_brute: z
          .boolean()
          .optional()
          .describe("Perform brute-force subdomain discovery."),
        enum_brute_wordlist: z
          .string()
          .optional()
          .describe(
            "Path to custom wordlist for brute force (e.g., '/path/to/wordlist.txt')."
          ),
      },
      async ({
        subcommand,
        domain,
        intel_whois,
        intel_organization,
        enum_type,
        enum_brute,
        enum_brute_wordlist,
      }) => {
        const args: string[] = [subcommand];

        if (subcommand === "enum") {
          if (!domain) {
            throw new Error("Domain is required for 'enum' subcommand.");
          }
          args.push("-d", domain);
          if (enum_type === "passive") {
            args.push("-passive");
          }
          if (enum_brute === true) {
            args.push("-brute");
            if (enum_brute_wordlist) {
              args.push("-w", enum_brute_wordlist);
            }
          }
        } else if (subcommand === "intel") {
          if (!domain && !intel_organization) {
            throw new Error(
              "Either domain or organization is required for 'intel' subcommand."
            );
          }
          if (domain) {
            args.push("-d", domain);
          }
          if (intel_organization) {
            args.push("-org", `'${intel_organization}'`);
          }
          if (intel_whois === true) {
            args.push("-whois");
          }
        }

        const command = `amass ${args.join(" ")}`;
        const note =
          "CLI execution is disabled on Render serverless. Copy this command and run it on a machine with Amass installed.";

        return {
          content: [
            {
              type: "text",
              text: `${note}\n\n${command}`,
            },
          ],
        };
      }
    );
  },
  {
    capabilities: {
      tools: {
        amass: {
          description:
            "Advanced subdomain reconnaissance using Amass (returns command to run locally).",
        },
      },
    },
  } as any,
  {
    basePath: "",
    verboseLogs: true,
    maxDuration: 60,
    disableSse: true,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
