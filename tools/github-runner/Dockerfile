FROM ubuntu:22.04

ENV ORGANIZATION=
ENV ACCESS_TOKEN=
ARG RUNNER_VERSION=2.311.0

RUN  useradd -m docker

RUN DEBIAN_FRONTEND=noninteractive \
    apt-get update -qq -y \
    && apt-get upgrade -qq -y \
    && apt-get install -qq -y --no-install-recommends jq curl ca-certificates

# install actions runner
WORKDIR /home/docker
RUN mkdir actions-runner && cd actions-runner \
    && curl -O -sL https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz \
    && tar xzf ./actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz

# install dependencies
RUN chown -R docker ~docker && /home/docker/actions-runner/bin/installdependencies.sh \    
    && rm -rf /var/lib/apt/lists/*

# install oc cli
RUN curl -c oc.tar -sL https://downloads-openshift-console.apps.silver.devops.gov.bc.ca/amd64/linux/oc.tar | tar -x \
    && rm -f oc.tar

# override start.sh
COPY start.sh start.sh
RUN chmod +x start.sh

USER docker

# set the entrypoint to the start.sh script
ENTRYPOINT ["./start.sh"]
