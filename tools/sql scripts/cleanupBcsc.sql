--bcsc
DECLARE @identityid uniqueidentifier
DECLARE @contactid uniqueidentifier;
select @identityid=spd_identityid, @contactid=spd_contactid from spd_identity where spd_userguid='EYZUYMYZSWIQLSKIDOZHJDB6HOJMEGZI'
PRINT @identityid
PRINT @contactid
delete from spd_address where spd_contact = @contactid
delete from spd_alias where spd_contactid = @contactid
delete from spd_licence where spd_licenceholder = @contactid
delete from spd_application where spd_submittedby = @contactid --probably failed if incidently is already created
delete from spd_identity where spd_identityid = @identityid