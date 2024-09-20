# secrets template
{{- define "secret.tpl" }}
{{- if .Values.secrets }}
kind: Secret
apiVersion: v1
metadata:
  name: {{ .name }}-secret
  labels: {{ .labels | nindent 4 }}
data:
  {{- range $key, $value := .Values.secrets }}
  {{ $key }}: {{ $value | toString | b64enc | quote }}
  {{ end -}}
{{- end }}
---
{{- if .Values.secretFiles }}
kind: Secret
apiVersion: v1
metadata:
  name: {{ .name }}-files-secret
  labels: {{ .labels | nindent 4 }}
data:
  {{- range $src, $dst := .Values.secretFiles }}
  {{ base $dst }}: {{ ($.Files.Get $src) | b64enc | quote }}
  {{- end -}}
{{- end -}}
{{- end -}}