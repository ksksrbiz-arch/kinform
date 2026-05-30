FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /srv/kinform

# Install shared + torqued-graph + service.
COPY packages/shared /srv/kinform/packages/shared
COPY packages/torqued-graph /srv/kinform/packages/torqued-graph
COPY apps/persona-genai /srv/kinform/apps/persona-genai

RUN pip install --upgrade pip && \
    pip install /srv/kinform/packages/shared \
                /srv/kinform/packages/torqued-graph \
                /srv/kinform/apps/persona-genai

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
