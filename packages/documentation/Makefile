.venv:
	python3 -m venv .venv
	. .venv/bin/activate; pip install -r requirements.txt

.PHONY: nsd
nsd:
	yarn nsd --cwd=../.. --docs-location="packages/documentation/docs/reference/Repository Scripts/"

public: .venv nsd
	. .venv/bin/activate; mkdocs build --config-file mkdocs.yml --site-dir public

serve: .venv
	. .venv/bin/activate; mkdocs serve --config-file mkdocs.yml
