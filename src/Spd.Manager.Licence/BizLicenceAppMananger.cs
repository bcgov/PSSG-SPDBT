using AutoMapper;
using MediatR;
using Spd.Resource.Repository.LicenceApplication;

namespace Spd.Manager.Licence;
internal class BizLicenceAppMananger :
    IRequestHandler<BizLicenceAppNewCommand, Guid>,
    IBizLicenceAppMananger
{
    public BizLicenceAppMananger(
        ILicenceApplicationRepository licenceAppRepository,
        IMapper mapper)
    {

    }

    public async Task<Guid> Handle(BizLicenceAppNewCommand cmd, CancellationToken cancellationToken)
    {
        return Guid.NewGuid();
    }
}
