namespace Spd.Resource.Applicants
{

    public enum PayerPreferenceTypeCode
    {
        Organization,
        Applicant
    }

    public record Paging(int Page, int PageSize);
    public record PaginationResp
    {
        public int PageSize { get; set; }
        public int PageIndex { get; set; }
        public int Length { get; set; }
    }
}

