import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminRecipes from "./AdminRecipes";

describe("AdminRecipes", () => {
  test("menampilkan halaman kelola resep", () => {
    render(
      <MemoryRouter>
        <AdminRecipes />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Kelola Resep" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+ Tambah Resep" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "☰" })).toBeInTheDocument();
  });

  test("menampilkan header tabel resep", () => {
    render(
      <MemoryRouter>
        <AdminRecipes />
      </MemoryRouter>
    );

    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.getByText("Judul Resep")).toBeInTheDocument();
    expect(screen.getByText("Waktu")).toBeInTheDocument();

    const kategoriElements = screen.getAllByText("Kategori");
    expect(kategoriElements.length).toBeGreaterThan(0);
  });
});