import { describe, test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "../Sidebar";

describe("Sidebar Component", () => {
    // Test options' components
    test("renders the Sidebar with correct options", () => {
        render(
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        );
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.getByText("Request Admin")).toBeInTheDocument();
    });

    // Test navigates features
    test("navigates to the correct page when clicking on links", () => {
        const { getByText } = render(
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        );

        fireEvent.click(getByText("Dashboard"));
        expect(window.location.pathname).toBe("/dashboard");

        fireEvent.click(getByText("Request Admin"));
        expect(window.location.pathname).toBe("/request-admin");
    });
});
