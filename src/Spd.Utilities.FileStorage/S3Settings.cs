namespace Spd.Utilities.FileStorage
{
    internal record StorageSetting
    {
        public S3Settings MainBucketSettings { get; set; } = new();
        public S3Settings TransientBucketSettings { get; set; } = new();
    }
    internal record S3Settings
    {
        public string AccessKey { get; set; } = null!;
        public string Secret { get; set; } = null!;
        public Uri Url { get; set; } = null!;
        public string Bucket { get; set; } = null!;
    }
}