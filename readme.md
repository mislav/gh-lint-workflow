# gh lint-workflow

An _experimental_ GitHub CLI extension to lint GitHub Actions YAML workflow files.
Built on top of [actions-yaml](https://github.com/ericsciple/actions-yaml).

Dependencies: `node`, `jq`

```sh
$ gh extension install mislav/gh-lint-workflow

$ gh lint-workflow .github/workflows/*.yml
```
