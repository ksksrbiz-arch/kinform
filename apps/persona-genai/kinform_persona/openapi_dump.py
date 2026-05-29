"""Dump the FastAPI OpenAPI spec to stdout.

Usage::

    python -m kinform_persona.openapi_dump > openapi.json

Wrapped by the root ``npm run openapi:dump`` script, which writes to
``apps/persona-genai/openapi.json``. That file is the contract source for
the TypeScript codegen in ``npm run gen:types``.
"""

from __future__ import annotations

import json
import sys

from kinform_persona.app import app


def main() -> None:
    json.dump(app.openapi(), sys.stdout, indent=2, sort_keys=True)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
