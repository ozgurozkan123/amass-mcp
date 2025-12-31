import os
from fastmcp import FastMCP

# Create the MCP server
mcp = FastMCP("amass-mcp")


@mcp.tool()
def amass(
    subcommand: str,
    domain: str = None,
    intel_whois: bool = False,
    intel_organization: str = None,
    enum_type: str = None,
    enum_brute: bool = False,
    enum_brute_wordlist: str = None,
) -> str:
    """
    Advanced subdomain reconnaissance using Amass.
    Returns the amass command to run locally since CLI execution is not available on serverless.

    Args:
        subcommand: Specify Amass operation mode - 'intel' gathers intelligence; 'enum' performs subdomain enumeration.
        domain: Target domain (e.g., example.com). Required for enum; optional for intel.
        intel_whois: Include WHOIS data during intelligence gathering.
        intel_organization: Organization name to search for during intelligence gathering.
        enum_type: Enumeration approach - 'active' performs DNS resolution; 'passive' only uses third-party sources.
        enum_brute: Perform brute-force subdomain discovery.
        enum_brute_wordlist: Path to custom wordlist for brute force.
    """
    if subcommand not in ["enum", "intel"]:
        return "Error: subcommand must be 'enum' or 'intel'"

    args = [subcommand]

    if subcommand == "enum":
        if not domain:
            return "Error: Domain is required for 'enum' subcommand."
        args.extend(["-d", domain])
        if enum_type == "passive":
            args.append("-passive")
        if enum_brute:
            args.append("-brute")
            if enum_brute_wordlist:
                args.extend(["-w", enum_brute_wordlist])

    elif subcommand == "intel":
        if not domain and not intel_organization:
            return "Error: Either domain or organization is required for 'intel' subcommand."
        if domain:
            args.extend(["-d", domain])
        if intel_organization:
            args.extend(["-org", f"'{intel_organization}'"])
        if intel_whois:
            args.append("-whois")

    command = f"amass {' '.join(args)}"
    note = "CLI execution is disabled on this server. Copy this command and run it on a machine with Amass installed."

    return f"{note}\n\n{command}"


# Use Streamable HTTP transport (recommended for web deployments)
# Render provides PORT=10000 by default
if __name__ == "__main__":
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "10000"))
    print(f"Starting amass-mcp server on http://{host}:{port}/mcp")
    mcp.run(transport="http", host=host, port=port, path="/mcp")
