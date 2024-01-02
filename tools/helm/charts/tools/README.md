# Sparc Helm Chart

This directory contains a Helm chart to deploy SPD Sparc tools

## Usage

To install a new environment, ensure the values.yaml matches the environment, then run the following command:

```sh
helm -n [tools namespace] install tools .
```

To upgrade an existing environment, run the following command:

```sh
helm -n [tools namespace] upgrade tools .
```

To remove an existing environment, run the following command:

```sh
helm -n [tools namespace] uninstall tools
```
