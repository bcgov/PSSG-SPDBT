using Bogus;
using Bogus.DataSets;

namespace Spd.Tests;

public static class BogusExtensions
{
    public static async Task<Memory<byte>> ByteArray(this Lorem dataset, int size)
    {
        using var ms = new MemoryStream();
        using var writer = new StreamWriter(ms);
        while (ms.Length < size)
        {
            await writer.WriteAsync(dataset.Text());
        }

        return new Memory<byte>(ms.ToArray(), 0, size);
    }

    public static async Task<TestFile> GenerateFile(this Faker faker, int size)
    {
        var fileName = faker.System.FileName("txt");
        var content = await faker.Lorem.ByteArray(size);

        return new TestFile(fileName, "plain/text", new MemoryStream(content.ToArray()));
    }

    public static async Task<TestFile> GenerateImage(this Faker faker)
    {
        using var httpClient = new HttpClient();
        var fileName = faker.System.FileName("jpg");
        var content = await (await httpClient.GetAsync(new Uri(faker.Image.LoremFlickrUrl()))).Content.ReadAsStreamAsync();

        return new TestFile(fileName, "image/jpg", content);
    }
}

public record TestFile(string FileName, string ContentType, Stream Content);