import "./style.css";
type Person = {
  readonly id: number;
  readonly name: string;
  birth_year: number;
  death_year?: number;
  biography: string;
  image: string;
};

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Just some - more - TypeScript Snacks!</h1>

    <p class="read-the-docs">
      Open up the console to check some logs
    </p>
  </div>
`;
