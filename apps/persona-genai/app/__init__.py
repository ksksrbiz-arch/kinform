"""KINFORM PersonaGenAI — FastAPI + LangGraph multi-agent orchestrator.

Public sub-modules:

* :mod:`app.schemas`       — strict Pydantic v2 contracts
* :mod:`app.agents`        — Brand Voice / Compliance / Analytics + supervisor
* :mod:`app.simulation`    — staging-layer wrapper
* :mod:`app.governance`    — re-export of cross-service rules
* :mod:`app.db`            — DB bootstrap + persistence helpers
* :mod:`app.main`          — ASGI entry point
"""

__version__ = "1.0.0"
