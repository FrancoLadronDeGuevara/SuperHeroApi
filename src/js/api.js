const API_URL =
  "https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/all.json";

export async function fetchHeroes() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP Error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching super heroes: ", error);
    return [];
  }
}
