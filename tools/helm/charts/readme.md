# Environment setup


## Install helm

To install helm chart, use the following command:

```sh
winget install helm.helm
```
Note another way to install helm: Open a "command prompt" as system administrator, go to "sparc" folder, use chocolate to install helm.

```
choco
choco install kubernetes-helm
```
## Sync "Dev hangout" files to local
go to teams/Dev hangout/ files, select "sync"

## Create a symlink by running this command

Open a "command prompt" as system administrator, go to "sparc" folder, use following command

```
mklink /D envs "C:\Users\[user]\Quartech Systems Limited\SPD QT No41 only - Dev hangout - secrets\envs"
```
