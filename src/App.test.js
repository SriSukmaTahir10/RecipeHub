import { render, screen } from "@testing-library/react";
import App from "./App";

test("menampilkan halaman login", () => {
  render(<App />);
  expect(screen.getByPlaceholderText(/masukkan email/i)).toBeInTheDocument();
});