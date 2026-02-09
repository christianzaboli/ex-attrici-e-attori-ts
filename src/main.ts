import "./style.css";
type Person = {
  readonly id: number;
  readonly name: string;
  birth_year: number;
  death_year?: number;
  biography: string;
  image: string;
};
type Actress = Person & {
  most_famous_movies: [string, string, string];
  awards: string;
  nationality:
    | "American"
    | "British"
    | "Australian"
    | "Israeli-American"
    | "South African"
    | "French"
    | "Indian"
    | "Israeli"
    | "Spanish"
    | "South Korean"
    | "Chinese";
};

// typeguard di supporto per il fetch asyncrono sottostate
function isActress(data: unknown): data is Actress {
  if (
    data &&
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    typeof data.id === "number" &&
    "name" in data &&
    typeof data.name === "string" &&
    "birth_year" in data &&
    typeof data.birth_year === "number" &&
    "death_year" in data &&
    typeof data.death_year === "number" &&
    "biography" in data &&
    typeof data.biography === "string" &&
    "image" in data &&
    typeof data.image === "string" &&
    "most_famous_movies" in data &&
    Array.isArray(data.most_famous_movies) &&
    data.most_famous_movies.length === 3 &&
    data.most_famous_movies.every((e) => typeof e === "string") &&
    "awards" in data &&
    typeof data.awards === "string" &&
    "nationality" in data &&
    typeof data.nationality === "string"
  ) {
    return true;
  } else {
    return false;
  }
}
async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`http://localhost:3333/actresses/${id}`);
    const data = await response.json();
    if (!isActress(data)) {
      throw new Error("la risposta non ha il formato giusto");
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("errore nel recupero", error);
    } else {
      console.error("errore sconosciuto", error);
    }
    return null;
  }
}
getActress(2).then((res) => console.log(res));

async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch("http://localhost:3333/actresses");
    const data: unknown = await response.json();
    if (!(data instanceof Array)) {
      throw new Error("la risposta non ha il formato giusto");
    }
    const validActresses: Actress[] = data.filter((a) => isActress(a));
    return validActresses;
  } catch (error) {
    if (error instanceof Error) {
      console.error("errore nel recupero", error);
    } else {
      console.error("errore sconosciuto", error);
    }
    return [];
  }
}
getAllActresses().then((res) => console.log(res));

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Just some - more - TypeScript Snacks!</h1>

    <p class="read-the-docs">
      Open up the console to check some logs
    </p>
  </div>
`;
