# HPA policy template
{{- define "hpa.tpl" }}
{{- if lt .Values.scaling.minReplicas .Values.scaling.maxReplicas -}}
kind: HorizontalPodAutoscaler
apiVersion: autoscaling/v2
metadata:
  name: {{ .name }}-hpa
  labels: {{ .labels | nindent 4 }}
spec:
  scaleTargetRef:
    kind: DeploymentConfig
    name: {{ .name }}-dc
    apiVersion: apps.openshift.io/v1
  minReplicas: {{ .Values.scaling.minReplicas }}
  maxReplicas: {{ .Values.scaling.maxReplicas }}
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: {{ .Values.scaling.cpuTargetAverageUtilizationPercentage }}
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization:  {{ .Values.scaling.memoryTargetAverageUtilizationPercentage }}
{{- end -}}
{{- end -}}