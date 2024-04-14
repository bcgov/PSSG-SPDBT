# Sparc Helm Chart

This directory contains a Helm chart to deploy SPD Sparc applications.

Each environment has its own folder under 'envs' that need to be mapped from the shared secured storage.
Start a command prompt with Administrator, then login to your openshift account.

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

## Dependencies

This chart depends on redis-sentinal chart.

Run the following command to initially build the chart's dependencies:

```sh
helm dep build
```

Run the following command to update the chart's dependencies:

```sh
helm dep update
```

## Development

To debug the generated yaml by this chart, run the followign command:

```sh
helm template . -f envs/[env]/values.yaml > debug.yaml
```

**warning**: do not commit debug.yaml to source control!
