using System;
using System.Collections.Generic;

namespace Spd.Resource.Applicants.Ministry
{
    public interface IMinistryRepository
    {
        public Task<MinistryListResp> QueryAsync(MinistryQry cmd, CancellationToken cancellationToken);
    }

    public record MinistryListResp
    {
        public IEnumerable<MinistryResp> Items { get; set; } = Array.Empty<MinistryResp>();
    }

    public record MinistryResp
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public bool IsActive { get; set; }
    }

    public record MinistryQry { };
}
