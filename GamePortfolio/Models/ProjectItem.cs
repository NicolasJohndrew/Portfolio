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

public sealed class SkillItem
{
    public int Id { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("sortOrder")]
    public int SortOrder { get; set; }
}

public sealed class SkillUpsert
{
    public string Category { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}

public sealed class ExperienceItem
{
    public int Id { get; set; }
    public string Organization { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("sortOrder")]
    public int SortOrder { get; set; }
}

public sealed class ExperienceUpsert
{
    public string Organization { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Period { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}

public sealed class SiteContent
{
    public GeneralContent General { get; set; } = new();
    public HeroContent Hero { get; set; } = new();
    public ProjectsContent Projects { get; set; } = new();
    public AboutContent About { get; set; } = new();
    public SkillsContent Skills { get; set; } = new();
    public ExperienceContent Experience { get; set; } = new();
    public ContactContent Contact { get; set; } = new();
}

public sealed class GeneralContent
{
    public string SiteName { get; set; } = "Johnny Nicolas";
    public string BrandMark { get; set; } = "JN";
    public string BrandSubline { get; set; } = "GAME DEV // PH";
    public string AvailabilityText { get; set; } = "Open to opportunities";
    public string FooterText { get; set; } = "© 2026 Johnny Andrew Nicolas";
    public string FooterTechText { get; set; } = "BUILT WITH C# / BLAZOR WASM";
}

public sealed class HeroContent
{
    public string EyebrowPrefix { get; set; } = "PLAYER 01";
    public string EyebrowText { get; set; } = "GAME PROGRAMMER + DEVELOPER";
    public string HeadingLine1 { get; set; } = "BUILDING WORLDS";
    public string HeadingLine2 { get; set; } = "PLAYERS REMEMBER.";
    public string Description { get; set; } = "I turn mechanics, atmosphere, and narrative into interactive experiences—from gameplay systems in Unity to experimental worlds in Godot.";
    public string PrimaryCtaLabel { get; set; } = "Explore games";
    public string PrimaryCtaHref { get; set; } = "#games";
    public string SecondaryCtaLabel { get; set; } = "Player profile";
    public string SecondaryCtaHref { get; set; } = "#profile";
    public string Meta1Label { get; set; } = "PRIMARY ENGINE";
    public string Meta1Value { get; set; } = "UNITY";
    public string Meta2Label { get; set; } = "LANGUAGE";
    public string Meta2Value { get; set; } = "C#";
    public string Meta3Label { get; set; } = "ALT ENGINE";
    public string Meta3Value { get; set; } = "GODOT";
    public string VisualTopLeft { get; set; } = "LIVE BUILD";
    public string VisualTopRight { get; set; } = "v01.26";
    public string VisualBottomLabel { get; set; } = "CREATIVE MODE";
    public string VisualBottomValue { get; set; } = "ACTIVE";
    public string FloatingTag1 { get; set; } = "GAMEPLAY SYSTEMS";
    public string FloatingTag2 { get; set; } = "LEVEL DESIGN";
    public string ScrollLabel { get; set; } = "SCROLL TO ENTER";
}

public sealed class ProjectsContent
{
    public string SectionLabel { get; set; } = "01 / SELECTED GAMES";
    public string Heading { get; set; } = "Choose your next world.";
    public string Intro { get; set; } = "Gameplay experiments, narrative systems, and interactive projects built with intention.";
    public string KickerLeft { get; set; } = "FEATURED BUILD";
    public string KickerRight { get; set; } = "GAME DEV";
    public string LinkLabel { get; set; } = "Launch project";
    public string EmptyLinkLabel { get; set; } = "Build link incoming";
}

public sealed class AboutContent
{
    public string SectionLabel { get; set; } = "02 / PLAYER PROFILE";
    public string HeadingLine1 { get; set; } = "Creative by instinct.";
    public string HeadingLine2 { get; set; } = "Technical by craft.";
    public string Paragraph1 { get; set; } = "Passionate and creative game developer with hands-on experience in Unity and Godot, focused on building game mechanics and clear, engaging digital experiences.";
    public string Paragraph2 { get; set; } = "My background also spans video production and UI/UX, giving me a wider lens on pacing, composition, presentation, and how players experience an interface.";
    public string Highlight1Title { get; set; } = "Unity";
    public string Highlight1Subtitle { get; set; } = "C# development";
    public string Highlight2Title { get; set; } = "Godot";
    public string Highlight2Subtitle { get; set; } = "GDScript development";
    public string Highlight3Title { get; set; } = "2026";
    public string Highlight3Subtitle { get; set; } = "BS EMC · Game Development";
    public string Highlight4Title { get; set; } = "Play.";
    public string Highlight4Subtitle { get; set; } = "Prototype. Test. Improve.";
}

public sealed class SkillsContent
{
    public string SectionLabel { get; set; } = "03 / LOADOUT";
    public string Heading { get; set; } = "Tools in the inventory.";
}

public sealed class ExperienceContent
{
    public string SectionLabel { get; set; } = "04 / EXPERIENCE LOG";
}

public sealed class ContactContent
{
    public string SectionLabel { get; set; } = "05 / START A NEW QUEST";
    public string HeadingLine1 { get; set; } = "Have a world";
    public string HeadingLine2 { get; set; } = "worth building?";
    public string Description { get; set; } = "Available for game development opportunities, creative collaborations, and projects where code meets experience.";
    public string Email { get; set; } = "johndrewherreranicolas@gmail.com";
    public string Location { get; set; } = "San Jose del Monte, Bulacan · Philippines";
}

public sealed class LoginRequest
{
    public string Password { get; set; } = string.Empty;
}

public static class SiteContentDefaults
{
    public static SiteContent Create() => new();
}
