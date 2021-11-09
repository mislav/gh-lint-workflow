vendor/actions-yaml-dist: vendor/actions-yaml
	cd vendor/actions-yaml; npm install
	cd vendor/actions-yaml; npm run-script build
	npm install && npm run env -- ncc build vendor/actions-yaml/dist/workflows/cli.js -o $@
	cp vendor/actions-yaml/dist/workflows/workflow-schema.json $@

vendor/actions-yaml:
	git submodule update --init -- $@
