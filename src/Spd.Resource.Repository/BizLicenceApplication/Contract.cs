using Spd.Resource.Repository.LicenceApplication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spd.Resource.Repository.BizLicenceApplication;

public partial interface IBizLicenceApplicationRepository
{
    public Task<Guid> CreateBizLicenceApplicationAsync(CreateBizLicenceApplicationCmd cmd, CancellationToken ct);
}

public record CreateBizLicenceApplicationCmd()
{

};
