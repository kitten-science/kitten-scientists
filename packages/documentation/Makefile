.venv:
	python3 -m venv .venv
	. .venv/bin/activate; pip install mkdocs-material

docs: .venv
	. .venv/bin/activate; mkdocs build --config-file mkdocs.yml --site-dir public

serve: .venv
	. .venv/bin/activate; mkdocs serve --config-file mkdocs.yml
