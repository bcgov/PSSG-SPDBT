# Spd.Utilities.Dataverse.EarlyBound

This project contains the Early Bound entities for the SPD application (Microsoft Dynamics 365 / Dataverse).

## Purpose

The `Spd.Utilities.Dataverse.EarlyBound` project provides strongly typed models and contracts so the API can read and write Dataverse records safely and consistently.

## Build

Build the project:

```bash
# From the repo root
dotnet build src/Spd.Utilities.Dataverse.EarlyBound/Spd.Utilities.Dataverse.EarlyBound.csproj
```

## Notes

- Most files in this project are generated from Dataverse metadata.
- Never manually update any files that say "generated" in a comment at the top.
- Regenerate classes when the Dataverse schema changes.
- The generator settings use readable C# casing for generated types and members, with targeted capitalization overrides for names the generator otherwise splits incorrectly. The Dataverse logical names and their spellings are unchanged. Regenerate with XrmToolBox to apply changes to generated files; do not edit those files by hand.

## XrmToolBox (quick)

Use [XrmToolBox](https://www.xrmtoolbox.com/) to regenerate early-bound classes when Dataverse metadata changes:

1. Run `XrmToolBox`
2. Add/open a connection the target Dynamics/Dataverse environment (**Dev**).
3. From the `Tools` menu, Install/open the early-bound generation plugin (**Early Bound Generator V2**).
4. Update the `Settings Path` to use the `EarlyBoundGeneratorSpdSettings.xml` from this folder.
   - This is the only file that should need to be manually edited, if any settings need to be adjusted.
5. Apply your changes if needed, for example, change Entities Whitelist to add or remove entities.
6. Run generation and review updated files in `Entities/`, `OptionSets/`, and related generated classes.
   - Verify generated C# names against their Dataverse logical names, especially for new options and messages, and keep the XML and paired `builderSettings.json` synchronized when adding capitalization overrides.
