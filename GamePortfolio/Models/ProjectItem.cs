using System.Text.Json.Serialization;

namespace GamePortfolio.Models;

public sealed class ProjectItem
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string? Link { get; set; }

    [JsonPropertyName("imageUrl")]
    public string? ImageUrl { get; set; }

    [JsonPropertyName("imageKey")]
    public string? ImageKey { get; set; }

    [JsonPropertyName("sortOrder")]
    public int SortOrder { get; set; }

    [JsonPropertyName("createdAt")]
    public string? CreatedAt { get; set; }

    [JsonPropertyName("updatedAt")]
    public string? UpdatedAt { get; set; }
}

public sealed class ProjectUpsert
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Link { get; set; }
    public string? ImageKey { get; set; }
    public int SortOrder { get; set; }
}

public sealed class UploadResponse
{
    public string Key { get; set; } = string.Empty;

    [JsonPropertyName("url")]
    public string Url { get; set; } = string.Empty;
}

public sealed class LoginRequest
{
    public string Password { get; set; } = string.Empty;
}
