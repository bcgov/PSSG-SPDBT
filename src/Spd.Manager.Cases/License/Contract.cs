using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.ManagerContract;
using System.ComponentModel;
using GenderCode = Spd.Utilities.Shared.ManagerContract.GenderCode;

namespace Spd.Manager.Cases.License
{
    public interface ILicenseManager
    {

    }

    public class WorkerLicenseCreateRequest
    { }

    public class WorkerLicenseCreateResponse
    { }
}
