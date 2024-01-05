# Sparc Helm Chart

This directory contains a Helm chart to deploy SPD Sparc applications.

Each environment has its own folder under 'envs' that need to be mapped from the shared secured storage.

## Usage

To install a new environment, ensure the values.yaml matches the environment, then run the following command:

```sh
helm -n [namespace] install [env name] . -f ./envs/[env name]/values.yaml
```
Example: 
```
C:\projects\spd\tools\helm\charts\sparc>helm -n fe7e29-test install testname . -f ./envs/test/values.yaml
```

To upgrade an existing environment, run the following command:

```sh
helm -n [namespace] upgrade [env name] . -f ./envs/[env name]/values.yaml
```
Example:
```
C:\projects\spd\tools\helm\charts\sparc>helm -n fe7e29-test upgrade testname . -f ./envs/test/values.yaml
```

To remove an existing environment, run the following command:

```sh
helm -n [namespace] uninstall [env name]
```
