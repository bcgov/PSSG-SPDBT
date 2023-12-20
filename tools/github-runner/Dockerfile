FROM ubuntu:22.04

ENV ORGANIZATION=
ENV ACCESS_TOKEN=
ENV NAME=
ARG RUNNER_VERSION=2.311.0

RUN useradd -m runner

RUN DEBIAN_FRONTEND=noninteractive \
    apt-get update -qq -y \
    && apt-get upgrade -qq -y \
    && apt-get install -qq -y --no-install-recommends jq curl ca-certificates

# install actions runner
WORKDIR /home/runner
RUN mkdir actions-runner && cd actions-runner \
    && curl -O -sL https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz \
    && tar xzf ./actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz

# install dependencies
RUN chown -R runner ~runner && /home/runner/actions-runner/bin/installdependencies.sh \    
    && rm -rf /var/lib/apt/lists/*

# install oc cli
RUN curl -c oc.tar -sL https://downloads-openshift-console.apps.silver.devops.gov.bc.ca/amd64/linux/oc.tar | tar -x \
    && rm -f oc.tar

# override start.sh
COPY --chown=runner:runner start.sh start.sh
RUN chmod u+x start.sh

USER runner

# set the entrypoint to the start.sh script
ENTRYPOINT ["./start.sh"]
