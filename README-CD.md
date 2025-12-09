# Continuous Deployment

## Deployment Process

1. **Run CD workflows** - GitHub Actions will build and push images to ghcr.io
2. **Run Tekton pipelines** - OpenShift pipelines will import and promote images

## Promotion Flow

```
ghcr.io:develop
    ↓
dev → test → training
          ↓
      staging → prod
```

## Available Pipelines

- `dev-release-pipeline` - Import from ghcr.io to dev
- `developing-release-pipeline` - Import from ghcr.io to developing
- `test-release-pipeline` - Promote dev to test
- `testing-release-pipeline` - Promote developing to testing
- `training-release-pipeline` - Promote test to training
- `staging-release-pipeline` - Promote test to staging
- `prod-release-pipeline` - Promote staging to prod
