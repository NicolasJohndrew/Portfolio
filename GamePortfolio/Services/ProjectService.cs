using System.Net;
using System.Net.Http.Json;
using GamePortfolio.Models;

namespace GamePortfolio.Services;

public sealed class ProjectService
{
    private readonly HttpClient _http;

    public ProjectService(HttpClient http)
    {
        _http = http;
    }

    public async Task<SiteContent> GetContentAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            return await _http.GetFromJsonAsync<SiteContent>("api/content", cancellationToken)
                   ?? SiteContentDefaults.Create();
        }
        catch
        {
            return SiteContentDefaults.Create();
        }
    }

    public async Task UpdateContentAsync(SiteContent content, CancellationToken cancellationToken = default)
    {
        var response = await _http.PutAsJsonAsync("api/content", content, cancellationToken);
        ThrowIfUnauthorized(response);
        response.EnsureSuccessStatusCode();
    }

    public async Task<List<ProjectItem>> GetProjectsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            return await _http.GetFromJsonAsync<List<ProjectItem>>("api/projects", cancellationToken) ?? [];
        }
        catch
        {
            return [];
        }
    }

    public async Task<ProjectItem?> CreateAsync(ProjectUpsert item, CancellationToken cancellationToken = default)
    {
        var response = await _http.PostAsJsonAsync("api/projects", item, cancellationToken);
        ThrowIfUnauthorized(response);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<ProjectItem>(cancellationToken: cancellationToken);
    }

    public async Task<ProjectItem?> UpdateAsync(int id, ProjectUpsert item, CancellationToken cancellationToken = default)
    {
        var response = await _http.PutAsJsonAsync($"api/projects/{id}", item, cancellationToken);
        ThrowIfUnauthorized(response);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<ProjectItem>(cancellationToken: cancellationToken);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var response = await _http.DeleteAsync($"api/projects/{id}", cancellationToken);
        ThrowIfUnauthorized(response);
        response.EnsureSuccessStatusCode();
    }

    public async Task<List<SkillItem>> GetSkillsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            return await _http.GetFromJsonAsync<List<SkillItem>>("api/skills", cancellationToken) ?? [];
        }
        catch
        {
            return [];
        }
    }

    public async Task<SkillItem?> CreateSkillAsync(SkillUpsert item, CancellationToken cancellationToken = default)
    {
        var response = await _http.PostAsJsonAsync("api/skills", item, cancellationToken);
        ThrowIfUnauthorized(response);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<SkillItem>(cancellationToken: cancellationToken);
    }

    public async Task<SkillItem?> UpdateSkillAsync(int id, SkillUpsert item, CancellationToken cancellationToken = default)
    {
        var response = await _http.PutAsJsonAsync($"api/skills/{id}", item, cancellationToken);
        ThrowIfUnauthorized(response);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<SkillItem>(cancellationToken: cancellationToken);
    }

    public async Task DeleteSkillAsync(int id, CancellationToken cancellationToken = default)
    {
        var response = await _http.DeleteAsync($"api/skills/{id}", cancellationToken);
        ThrowIfUnauthorized(response);
        response.EnsureSuccessStatusCode();
    }

    public async Task<List<ExperienceItem>> GetExperienceAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            return await _http.GetFromJsonAsync<List<ExperienceItem>>("api/experience", cancellationToken) ?? [];
        }
        catch
        {
            return [];
        }
    }

    public async Task<ExperienceItem?> CreateExperienceAsync(ExperienceUpsert item, CancellationToken cancellationToken = default)
    {
        var response = await _http.PostAsJsonAsync("api/experience", item, cancellationToken);
        ThrowIfUnauthorized(response);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<ExperienceItem>(cancellationToken: cancellationToken);
    }

    public async Task<ExperienceItem?> UpdateExperienceAsync(int id, ExperienceUpsert item, CancellationToken cancellationToken = default)
    {
        var response = await _http.PutAsJsonAsync($"api/experience/{id}", item, cancellationToken);
        ThrowIfUnauthorized(response);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<ExperienceItem>(cancellationToken: cancellationToken);
    }

    public async Task DeleteExperienceAsync(int id, CancellationToken cancellationToken = default)
    {
        var response = await _http.DeleteAsync($"api/experience/{id}", cancellationToken);
        ThrowIfUnauthorized(response);
        response.EnsureSuccessStatusCode();
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

    private static void ThrowIfUnauthorized(HttpResponseMessage response)
    {
        if (response.StatusCode == HttpStatusCode.Unauthorized)
            throw new UnauthorizedAccessException();
    }
}
