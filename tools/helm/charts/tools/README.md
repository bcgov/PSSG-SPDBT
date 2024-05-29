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

# Sysdig

Setup Steps:

### 1. switch to the tools namespace

```sh
oc project fe7e29-tools
```

### 2. apply the manifest

```sh
oc apply -f ./templates/sysdig-team-spd.yaml
```

### 3. verfify sysdig team creation

```sh
oc describe sysdig-team fe7e29-sysdigteam
```

or

```sh
oc get sysdig-teams
```

If both of these show, the sysdig-team custom resource is processed successfully. You can go back to Sysdig to see the new team scope and default dashboards.
