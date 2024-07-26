# deployment config template
{{- define "dc.tpl" }}
kind: DeploymentConfig
apiVersion: apps.openshift.io/v1
metadata:
  name: {{ .name }}
  labels: {{ .labels | nindent 4 }}
spec:
  replicas: {{ .Values.scaling.minReplicas }}
  revisionHistoryLimit: 10
  strategy:
    type: Rolling
    rollingParams:
      maxUnavailable: 50%
      maxSurge: 50%
    resources:
      limits:
        cpu: 15m
        memory: 64Mi
      requests:
        cpu: 5m
        memory: 32Mi
  selector:
    name: {{ .name }}
  template:
    metadata:
      name: {{ .name }}
      labels:
        name: {{ .name }}
        role: {{ .Values.role }}
        DataClass: {{ .Values.dataClass }}
        {{- if .Values.allowInternet }}
        Internet-Ingress: ALLOW
        {{- end }}
      {{- if or (gt (len .Values.secrets) 0) (.Values.secretFiles).files -}}
      {{- if gt (len .Values.secrets) 0 }}
      annotations:
        checksum/secret: {{ .Values.secrets | toYaml | sha256sum }}
      {{- end }}
      {{- if (.Values.secretFiles).files }}
      annotations:
      {{- range $file :=.Values.secretFiles.files }}
        checksum/{{ base $file | replace "." "-" }}: {{ $.Files.Get $file | toYaml | sha256sum }}
      {{- end -}}
      {{- end -}}
      {{- end }}
    spec:
      hostAliases:
        - ip: "142.34.159.58"
          hostnames:
          - "ststest.gov.bc.ca"
        - ip: "142.34.159.59"
          hostnames:
          - "sts.gov.bc.ca"
      containers:
        - name: {{ .name }}
          image: {{ .Values.image.name }}:{{ .Values.image.tag }}
          imagePullPolicy: Always
          resources: {{ .Values.resources | toYaml | nindent 12 }}

          {{- if .Values.env }}
          env:
          {{- range $key, $value := .Values.env }}
            - name: {{ $key }}
              value: {{ $value | quote }}
          {{- end }}
          {{- end -}}

          {{- if or .Values.volumeMounts .Values.secretFiles }}
          volumeMounts:
            {{- if .Values.volumeMounts }}
            {{ .Values.volumeMounts | toYaml | nindent 12 }}
            {{ end -}}
            {{- if (.Values.secretFiles).files }}
            - name: {{ $.name}}-secret
              mountPath: {{ .Values.secretFiles.mountPath }}
            {{ end -}}
            {{- end }}

          {{- if .Values.port }}
          ports:
            - containerPort: {{ .Values.port }}
              protocol: {{ .Values.protocol | default "TCP" | upper }}
          {{- end }}

          {{- if .Values.livenessProbe }}
          livenessProbe: {{ .Values.livenessProbe | toYaml | nindent 12 }}
          {{- end }}

          {{- if .Values.readinessProbe }}
          readinessProbe: {{ .Values.readinessProbe | toYaml | nindent 12 }}
          {{- end }}

          {{- if .Values.startupProbe }}
          startupProbe: {{ .Values.startupProbe | toYaml | nindent 12 }}
          {{- end }}

      dnsPolicy: ClusterFirst
      restartPolicy: Always
      terminationGracePeriodSeconds: 30

      {{- if or .Values.volumes .Values.secretFiles }}
      volumes:
        {{- if .Values.volumes }}
        {{ tpl (.Values.volumes | toYaml) $ | nindent 8 }}
        {{ end -}}      
        {{- if (.Values.secretFiles).files }}
        - name: {{ $.name}}-secret
          secret:
            secretName: {{ $.name}}-secret
        {{- end }}
      {{- end }}
  triggers:
    - type: ConfigChange
    - type: ImageChange
      imageChangeParams:
        automatic: true
        containerNames:
          - {{ .name }}
        from:
          kind: ImageStreamTag
          name: {{ base .Values.image.name }}:{{ .Values.image.tag }}
          namespace: {{ .Values.image.triggerNamespace }}
{{- end }}
