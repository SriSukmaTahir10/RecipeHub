import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RecipeCard from "./RecipeCard";

const recipe = {
  id: "123",
  title: "Nasi Goreng Spesial",
  image: "/images/nasi-goreng-special.png",
  time: "35 Menit",
  rating: 4.7,
};

describe("RecipeCard", () => {
  test("menampilkan judul dan gambar resep", () => {
    const { container } = render(
      <MemoryRouter>
        <RecipeCard recipe={recipe} />
      </MemoryRouter>
    );

    expect(screen.getByText("Nasi Goreng Spesial")).toBeInTheDocument();

    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/images/nasi-goreng-special.png");
  });

  test("memiliki link ke halaman detail resep", () => {
    render(
      <MemoryRouter>
        <RecipeCard recipe={recipe} />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: /lihat detail/i });
    expect(link).toHaveAttribute("href", "/detail/123");
  });
});