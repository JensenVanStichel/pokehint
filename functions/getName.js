const fs = require("fs").promises;

async function loadNameMappings() {
  try {
    const languages = ["english", "japanese", "german", "french"];
    const nameMappings = {};

    for (const language of languages) {
      const [data1, data2] = await Promise.all([
        fs.readFile(
          `./data/languages/english-to-language/${language}.json`,
          "utf8"
        ),
        fs.readFile(
          `./data/languages/language-to-english/${language}.json`,
          "utf8"
        ),
      ]);

      nameMappings[language] = {
        ...JSON.parse(data1),
        ...JSON.parse(data2),
      };
    }

    return nameMappings;
  } catch (error) {
    throw new Error("[PokeHint] Error loading name mappings: " + error.message);
  }
}

async function getName({ name, language, inputLanguage }) {
  let languageToUse = language ?? "random";
  if (languageToUse === "random") {
    const languages = ["English", "Japanese", "German", "French"];
    languageToUse = languages[Math.floor(Math.random() * languages.length)];
  }
  let inputLanguageToUse = inputLanguage ?? "English";

  if (!name)
    throw new Error("[PokeHint] Could not find a pokemon name to convert.");
  const nameMappings = await loadNameMappings();

  try {
    convertedName =
      nameMappings[languageToUse.toLowerCase()][name.toLowerCase()];
  } catch (error) {
    throw new Error(
      `[PokeHint] Unable to find a conversion to ${languageToUse} for the Pokemon name: ${name}`
    );
  }

  switch (languageToUse) {
    case "English":
      switch (inputLanguageToUse) {
        case "English":
          return name;
        case "Japanese":
          englishName = nameMappings["japanese"][name.toLowerCase()];
          return englishName;
        case "German":
          englishName = nameMappings["german"][name.toLowerCase()];
          return englishName;
        case "French":
          englishName = nameMappings["french"][name.toLowerCase()];
          return englishName;
        default:
          throw new Error(
            "[PokeHint] Invalid inputLanguage, please choose between: English, Japanese, German, or French."
          );
      }

    case "Japanese":
      switch (inputLanguageToUse) {
        case "English":
          return convertedName;
        case "Japanese":
          return name;
        case "German":
          englishName = nameMappings["german"][name.toLowerCase()];
          return nameMappings["japanese"][englishName.toLowerCase()];
        case "French":
          englishName = nameMappings["french"][name.toLowerCase()];
          return nameMappings["japanese"][englishName.toLowerCase()];
        default:
          throw new Error(
            "[PokeHint] Invalid inputLanguage, please choose between: English, Japanese, German, or French."
          );
      }
    case "German":
      switch (inputLanguageToUse) {
        case "English":
          return convertedName;
        case "Japanese":
          englishName = nameMappings["japanese"][name.toLowerCase()];
          return nameMappings["german"][englishName.toLowerCase()];
        case "German":
          return name;
        case "French":
          englishName = nameMappings["french"][name.toLowerCase()];
          return nameMappings["german"][englishName.toLowerCase()];
        default:
          throw new Error(
            "[PokeHint] Invalid inputLanguage, please choose between: English, Japanese, German, or French."
          );
      }
    case "French":
      switch (inputLanguageToUse) {
        case "English":
          return convertedName;
        case "Japanese":
          englishName = nameMappings["japanese"][name.toLowerCase()];
          return nameMappings["french"][englishName.toLowerCase()];
        case "German":
          englishName = nameMappings["german"][name.toLowerCase()];
          return nameMappings["french"][englishName.toLowerCase()];
        case "French":
          return name;
        default:
          throw new Error(
            "[PokeHint] Invalid inputLanguage, please choose between: English, Japanese, German, or French."
          );
      }
    default:
      throw new Error(
        "[PokeHint] Invalid language, please choose between: English, Japanese, German, or French."
      );
  }
}

module.exports = getName;
