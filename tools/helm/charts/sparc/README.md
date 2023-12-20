# Sparc Helm Chart

This directory contains a Helm chart to deploy SPD Sparc applications

## Usage

To install a new environment, ensure the values.yaml matches the environment, then run the following command:

```sh
helm -n [namespace] install [env name] .
```

To upgrade an existing environment, run the following command:

```sh
helm -n [namespace] upgrade [env name] .
```

To remove an existing environment, run the following command:

```sh
helm -n [namespace] uninstall [env name]
```
