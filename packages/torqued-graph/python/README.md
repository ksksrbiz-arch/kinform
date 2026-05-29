# KINFORM Torqued Graph — Python mirror

SQLAlchemy 2.x models that mirror the canonical Prisma schema in
`../prisma/schema.prisma`. This package is consumed by the PersonaGenAI service
(`apps/persona-genai`) so the agent system can persist campaigns and
validation logs from Python.

## Install (editable, from this directory)

```bash
pip install -e .
```

Or from the persona-genai service `pyproject.toml`:

```toml
dependencies = [
  "kinform-torqued-graph @ file:../../packages/torqued-graph/python",
]
```

## Parity guarantee

The TypeScript enum values in `../src/enums.ts` and the Python enum values in
`kinform_torqued_graph/enums.py` MUST stay value-identical. CI asserts this by
parsing both files. When you change one, change the other in the same PR.
