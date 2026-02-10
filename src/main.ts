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

type Actor = Person & {
  known_for: [string, string, string];
  awards: [string] | [string, string];
  nationality:
    | Actress["nationality"]
    | "Scottish"
    | "New Zealand"
    | "Hong Kong"
    | "German"
    | "Canadian"
    | "Irish";
};
// typeguard di supporto per il fetch asyncrono sottostate
function isActress(data: unknown): data is Actress {
  return (
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
    data.most_famous_movies instanceof Array &&
    data.most_famous_movies.length === 3 &&
    data.most_famous_movies.every((e) => typeof e === "string") &&
    "awards" in data &&
    typeof data.awards === "string" &&
    "nationality" in data &&
    typeof data.nationality === "string"
  );
}
function isActor(data: unknown): data is Actor {
  return (
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
    "known_for" in data &&
    data.known_for instanceof Array &&
    data.known_for.length === 3 &&
    data.known_for.every((e) => typeof e === "string") &&
    "awards" in data &&
    data.awards instanceof Array &&
    (data.awards.length === 1 || data.awards.length === 2) &&
    data.awards.every((e) => typeof e === "string") &&
    "nationality" in data &&
    typeof data.nationality === "string"
  );
}

// ONE FETCH -----------------------------------------------------------------------
// F
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
      console.error(`errore nel recupero di id ${id}`, error);
    } else {
      console.error("errore sconosciuto", error);
    }
    return null;
  }
}
getActress(2).then((res) => console.log("Risultato di getActress", res));

// M
async function getActor(id: number): Promise<Actor | null> {
  try {
    const response = await fetch(`http://localhost:3333/actors/${id}`);
    const data = await response.json();
    if (!isActor(data)) {
      throw new Error("la risposta non ha il formato giusto");
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`errore nel recupero di id ${id}`, error);
    } else {
      console.error("errore sconosciuto", error);
    }
    return null;
  }
}
getActor(1).then((res) => console.log("Risultato di getActor", res));

// FULL FETCH -----------------------------------------------------------------------
// F
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

// M
async function getAllActors(): Promise<Actor[]> {
  try {
    const response = await fetch("http://localhost:3333/actors");
    const data: unknown = await response.json();
    if (!(data instanceof Array)) {
      throw new Error("la risposta non ha il formato giusto");
    }
    const validActors: Actor[] = data.filter((a) => isActor(a));
    return validActors;
  } catch (error) {
    if (error instanceof Error) {
      console.error("errore nel recupero", error);
    } else {
      console.error("errore sconosciuto", error);
    }
    return [];
  }
}

// MULTI FETCH -----------------------------------------------------------------------
// F
async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  try {
    const promises = ids.map((id) => getActress(id));
    return await Promise.all(promises);
  } catch (error) {
    if (error instanceof Error) {
      console.error("errore nel recupero", error);
    } else {
      console.error("errore sconosciuto", error);
    }
    return [];
  }
}
getActresses([1, 2, 3]).then((res) =>
  console.log("Risultato di getActresses", res),
);

// M
async function getActors(ids: number[]): Promise<(Actor | null)[]> {
  try {
    const promises = ids.map((id) => getActor(id));
    return await Promise.all(promises);
  } catch (error) {
    if (error instanceof Error) {
      console.error("errore nel recupero", error);
    } else {
      console.error("errore sconosciuto", error);
    }
    return [];
  }
}
getActors([1, 2, 3]).then((res) => console.log("Risultato di getActors", res));

// bonus omit - partial
function createActress(data: Omit<Actress, "id">): Actress {
  return {
    id: Math.floor(Math.random() * 100),
    ...data,
  };
}
function updateActress(
  actress: Actress,
  updates: Partial<Omit<Actress, "id" | "name">>,
): Actress {
  return {
    ...actress,
    ...updates,
  };
}

// bonus 2
async function createRandomCouple(): Promise<[Actress, Actor] | null> {
  try {
    const actorsRes = await fetch("http://localhost:3333/actors");
    const actorsData: unknown = await actorsRes.json();
    const actressRes = await fetch("http://localhost:3333/actresses");
    const actressData: unknown = await actressRes.json();
    if (!(actorsData instanceof Array) || !(actressData instanceof Array)) {
      throw new Error("la risposta non ha il formato giusto");
    }
    const validActors: Actor[] = actorsData.filter((a) => isActor(a));
    const validActresses: Actress[] = actressData.filter((a) => isActress(a));
    return [
      validActresses[Math.floor(Math.random() * validActresses.length)],
      validActors[Math.floor(Math.random() * validActors.length)],
    ];
  } catch (error) {
    if (error instanceof Error) {
      console.error("errore nel recupero", error);
    } else {
      console.error("errore sconosciuto", error);
    }
    return null;
  }
}
// bonus 2 versione piu' carina
async function createRandomCouple2(): Promise<[Actress, Actor] | null> {
  try {
    const [actresses, actors] = await Promise.all([
      getAllActresses(),
      getAllActors(),
    ]);
    if (actresses.length === 0 || actors.length === 0) return null;
    return [
      actresses[Math.floor(Math.random() * actresses.length)],
      actors[Math.floor(Math.random() * actors.length)],
    ];
  } catch (error) {
    if (error instanceof Error) {
      console.error("errore nel recupero", error);
    } else {
      console.error("errore sconosciuto", error);
    }
    return null;
  }
}
createRandomCouple().then((res) =>
  console.log("Risultato di createRandomCouple", res),
);
createRandomCouple2().then((res) =>
  console.log("Risultato di createRandomCouple2", res),
);
// html
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Just some - more - TypeScript Snacks!</h1>

    <p class="read-the-docs">
      Open up the console to check some logs
    </p>
  </div>
`;
