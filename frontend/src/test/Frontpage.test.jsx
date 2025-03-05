import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Frontpage from "../Frontpage";

describe("Frontpage Component", () => {
    it("renders the Carbon Footprint title", () => {
        render(
            <MemoryRouter>
                <Frontpage />
            </MemoryRouter>
        );

        expect(
            screen.getByRole("heading", { level: 1, name: /carbon footprint calculator/i })
        ).toBeInTheDocument();
    });

    it("renders Register and Sign In buttons with correct links", () => {
        render(
            <MemoryRouter>
                <Frontpage />
            </MemoryRouter>
        );

        const registerButton = screen.getByRole("button", { name: /register/i });
        expect(registerButton).toBeInTheDocument();
        expect(registerButton.closest("a")).toHaveAttribute("href", "/register");

        const signInButton = screen.getByRole("button", { name: /sign in/i });
        expect(signInButton).toBeInTheDocument();
        expect(signInButton.closest("a")).toHaveAttribute("href", "/sign-in");
    });
});
