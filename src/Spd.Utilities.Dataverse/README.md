# Dataverse project scaffolding

`Spd.Utilities.Dataverse` references `Spd.Utilities.Dataverse.EarlyBound` and carries the Dataverse SDK packages used by ESS. Neither project is registered with the application or used by the existing Dynamics OData client yet.

The early-bound project intentionally contains no generated entities or ESS-specific generator settings. Generate SPD entities from the SPD Dataverse environment when the schema and required entity set are known; do not copy ESS's generated entities or whitelist.
