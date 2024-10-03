.venv:
	python3 -m venv .venv
	. .venv/bin/activate; pip install mkdocs-material

public: .venv
	yarn nsd --cwd=../.. --docs-location="packages/documentation/docs/reference/Repository Scripts/"
	. .venv/bin/activate; mkdocs build --config-file mkdocs.yml --site-dir public

serve: .venv
	. .venv/bin/activate; mkdocs serve --config-file mkdocs.yml
