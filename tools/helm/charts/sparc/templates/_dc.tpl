# deployment config template
{{- define "dc.tpl" }}
kind: DeploymentConfig
apiVersion: apps.openshift.io/v1
metadata:
  name: {{ .name }}
  labels: {{ .labels | nindent 4 }}
spec:
  replicas: {{ .Values.replicas }}
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
      {{- if gt (len .Values.secrets) 0 }}
      annotations:
        checksum/secret: {{ .Values.secrets | toYaml | sha256sum }}
      {{- end }}
    spec:
      imagePullSecrets:
        - name: artifactory-pull-secret
      containers:
        - name: {{ .name }}
          image: {{ .Values.image.name}}:{{ .Values.image.tag }}
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
          volumeMounts: {{ .Values.volumeMounts | toYaml | nindent 12 }}
          {{- if (.Values.secretFiles).files }}
            - name: {{ $.name}}-secret
              mountPath: {{ .Values.secretFiles.mountPath }}
          {{ end -}}
          {{- end -}}

          ports:
            - containerPort: {{ .Values.port }}
              protocol: {{ .Values.protocol | upper }}


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
      volumes: {{ tpl (.Values.volumes | toYaml) $ | nindent 8 }}
        {{- if (.Values.secretFiles).files }}
        - name: {{ $.name}}-secret
          secret:
            secretName: {{ $.name}}-secret
        {{- end }}
      {{- end }}

  # triggers:
  #   - type: ConfigChange
  #   - type: ImageChange
  #     imageChangeParams:
  #       automatic: true
  #       containerNames:
  #         - {{ .name }}
  #       from:
  #         kind: ImageStreamTag
  #         name: {{ base .Values.image.name }}:{{ .Values.image.tag }}
  #         namespace: {{ .Values.image.triggerNamespace }}
{{- end }}
