import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

describe("Login", () => {
  test("menampilkan form login awal", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByText("Daftar")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Masukkan email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Masukkan password")).toBeInTheDocument();
    expect(screen.getByText("Daftar di sini")).toBeInTheDocument();
    expect(screen.getByText("Lupa password?")).toBeInTheDocument();
  });

  test("berpindah ke mode daftar saat klik Daftar di sini", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Daftar di sini"));

    expect(screen.getByRole("button", { name: "Daftar" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ulangi password")).toBeInTheDocument();
    expect(screen.getByText("Sudah punya akun?")).toBeInTheDocument();
    expect(screen.getByText("Login di sini")).toBeInTheDocument();
  });
});