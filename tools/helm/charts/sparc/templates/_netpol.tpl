# network policy template
{{- define "netpol.tpl" -}}
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: {{ .name }}-netpol
  labels: {{ .labels | nindent 4 }}
spec:
  podSelector:
    matchLabels:
      name: {{ .name }}
  {{- if .Values.egress }}
  egress: {{ tpl (.Values.egress | toYaml) $ | nindent 4 }}
  {{- end }}
  {{- if .Values.ingress }}
  ingress: {{ tpl (.Values.ingress | toYaml) $ | nindent 4 }}
  {{- end }}
{{- end -}}
