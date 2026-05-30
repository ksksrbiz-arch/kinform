"""DB bootstrap convenience for the FastAPI service."""

from torqued_graph import init_db  # re-export

__all__ = ["init_db"]
