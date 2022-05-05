# Unity metafiles generator

This action generates a metafiles for Unity packages. The current version supports generating metafiles only for following files:

- `package.json`
- `*.dll` files
- directories

## Usage

Inside a workflow file define following step:

```(yml)
- name: Generate metafiles
  uses: rouvydev/metagen-gha
  with:
    seed: 'random string'
    directory: 'path/to/directory/with/package.json'
```

The directory parameter should point on folder with package.json file for Unity package. Insisde this folder will this action generate metafiles for all files and subdirectories.
