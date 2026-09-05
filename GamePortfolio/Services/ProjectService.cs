using System.Net;
using System.Net.Http.Json;
using GamePortfolio.Models;
using Microsoft.AspNetCore.Components.Forms;

namespace GamePortfolio.Services;

public sealed class ProjectService
{
    private readonly HttpClient _http;

    public ProjectService(HttpClient http)
    {
        _http = http;
    }

    public async Task<List<ProjectItem>> GetProjectsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var projects = await _http.GetFromJsonAsync<List<ProjectItem>>(
                "api/projects",
                cancellationToken);

            return projects ?? [];
        }
        catch
        {
            return [];
        }
    }

    public async Task<bool> LoginAsync(string password, CancellationToken cancellationToken = default)
    {
        var response = await _http.PostAsJsonAsync(
            "api/login",
            new LoginRequest { Password = password },
            cancellationToken);

        return response.IsSuccessStatusCode;
    }

    public async Task LogoutAsync(CancellationToken cancellationToken = default)
    {
        await _http.PostAsync("api/logout", null, cancellationToken);
    }

    public async Task<bool> IsAuthenticatedAsync(CancellationToken cancellationToken = default)
    {
        var response = await _http.GetAsync("api/session", cancellationToken);
        return response.IsSuccessStatusCode;
    }

    public async Task<ProjectItem?> CreateAsync(ProjectUpsert item, CancellationToken cancellationToken = default)
    {
        var response = await _http.PostAsJsonAsync("api/projects", item, cancellationToken);

        if (response.StatusCode == HttpStatusCode.Unauthorized)
            throw new UnauthorizedAccessException();

        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<ProjectItem>(cancellationToken: cancellationToken);
    }

    public async Task<ProjectItem?> UpdateAsync(int id, ProjectUpsert item, CancellationToken cancellationToken = default)
    {
        var response = await _http.PutAsJsonAsync($"api/projects/{id}", item, cancellationToken);

        if (response.StatusCode == HttpStatusCode.Unauthorized)
            throw new UnauthorizedAccessException();

        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<ProjectItem>(cancellationToken: cancellationToken);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var response = await _http.DeleteAsync($"api/projects/{id}", cancellationToken);

        if (response.StatusCode == HttpStatusCode.Unauthorized)
            throw new UnauthorizedAccessException();

        response.EnsureSuccessStatusCode();
    }

    public async Task<UploadResponse?> UploadImageAsync(IBrowserFile file, CancellationToken cancellationToken = default)
    {
        const long maxBytes = 5 * 1024 * 1024;

        using var form = new MultipartFormDataContent();
        await using var stream = file.OpenReadStream(maxBytes, cancellationToken);

        using var fileContent = new StreamContent(stream);
        fileContent.Headers.ContentType =
            new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);

        form.Add(fileContent, "file", file.Name);

        var response = await _http.PostAsync("api/upload", form, cancellationToken);

        if (response.StatusCode == HttpStatusCode.Unauthorized)
            throw new UnauthorizedAccessException();

        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<UploadResponse>(cancellationToken: cancellationToken);
    }
}
