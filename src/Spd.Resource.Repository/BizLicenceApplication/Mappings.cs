using AutoMapper;
using Microsoft.Dynamics.CRM;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spd.Resource.Repository.BizLicenceApplication;
internal class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<CreateBizLicenceApplicationCmd, spd_application>();
    }
}
