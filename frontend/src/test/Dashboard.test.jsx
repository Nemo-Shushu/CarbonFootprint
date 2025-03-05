import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Dashboard } from "../Dashboard";
import { useAuth } from "../useAuth";



// Mock useAuth hook
vi.mock("../useAuth", () => ({
    useAuth: () => true, // user login in 
}));



describe("Dashboard Component", () => {
    it("renders the Dashboard component", async () => {
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(
                screen.getByRole("heading", { level: 1, name: /dashboard/i }), // Search all topic 
                screen.getAllByText("Available Reports")
            ).toBeInTheDocument();
        });
    });
});

describe("Dashboard component - Table headers", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the table headers for normal users", async () => {
        vi.spyOn(require("react"), "useState").mockReturnValueOnce([false, vi.fn()]);
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        await waitFor(() => {

            const headers = screen.getAllByRole('columnheader').map((th) => th.textContent);
            expect(headers).toEqual(["#", "Academic Institution", "Research Field", "Total Emissions"])
        });

        // Admin Dashborad element not exist
        expect(screen.queryByText("Email")).not.toBeInTheDocument();
    });

    it("renders the table headers for admin users", async () => {

        // is_admin = true
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ isAdmin: true }),
            })
        );
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        await waitFor(() => {
            const headers = screen.getAllByRole('columnheader').map((th) => th.textContent);
            expect(headers).toEqual(["#", "Academic Institution", "Research Field", "Total Emissions",])
        });
        // Admin Dashborad element exist
        expect(screen.queryByText("Email")).toBeInTheDocument();
    });

    it("opens Modal with correct data when a report row is clicked", async () => {
        // Mock API 
        global.fetch = vi.fn((url) => {
            if (url.includes("dashboard_show_user_result_data")) {
                return Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve([
                            { id: 1, institution: "Test University", field: "CS", emissions: 100 },
                        ]),
                });
            }
            if (url.includes("get_all_report_data")) {
                return Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve({
                            calculations_data: { total: 100 },
                            report_data: { details: "Test Report" },
                        }),
                });
            }
            return Promise.reject(new Error("Unexpected API call"));
        });

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        await waitFor(() => screen.getByText("Test University"));
        fireEvent.click(screen.getByText("Test University"));
        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeInTheDocument();
            expect(screen.getByText("Carbon Emissions Data for: Report #1")).toBeInTheDocument();
        });
    });

    it("toggles Profile visibility when clicked", async () => {
        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );

        const profileImage = screen.getByTestId("profile-icon");
        expect(screen.queryByTestId("profile-btn")).not.toBeInTheDocument();
        expect(screen.queryByTestId("setting-btn")).not.toBeInTheDocument();
        fireEvent.click(profileImage);
        expect(screen.getByTestId("profile-btn")).toBeInTheDocument();
        expect(screen.queryByTestId("setting-btn")).toBeInTheDocument();
        fireEvent.click(profileImage);
        expect(screen.queryByTestId("profile-btn")).not.toBeInTheDocument();
        expect(screen.queryByTestId("setting-btn")).not.toBeInTheDocument();

        fireEvent.click(profileImage);
        fireEvent.click(document.body);
        await waitFor(() => {
            expect(screen.queryByText("profile-btn")).not.toBeInTheDocument();
        });
    });

});


describe("Dashboard Component - Authentication", () => {
    beforeEach(async () => {
        vi.resetModules();

        vi.doMock("../useAuth", () => ({
            useAuth: vi.fn(() => false), // return useAuth = false
        }));
    });

    it("redirects to sign-in when not authenticated", async () => {
        const { useAuth } = await import("../useAuth");
        expect(useAuth()).toBe(false);

        render(
            <MemoryRouter>
                <Dashboard />
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(window.location.pathname).toBe("/");
        });
    });
});


