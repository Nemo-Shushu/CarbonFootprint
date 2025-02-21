import { describe, test, expect, within } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminTool from "../AdminTools";

describe("Sidebar Component", () => {

    test("renders the Sidebar with correct options", () => {
        render(
            <BrowserRouter>
                <AdminTool />
            </BrowserRouter>
        );

        expect(screen.getByText("Id")).toBeInTheDocument();
        const tableHeader = screen.getByRole("columnheader", { name: "Request Admin" });
        expect(tableHeader).toBeInTheDocument();  
        expect(screen.getByText("Email")).toBeInTheDocument();
        expect(screen.getByText("Confirmation")).toBeInTheDocument();
    });

    /* This should update after backend connection */
    // test("truncates long text and expands on click", () => {
    //     render(<AdminTool />);

    //     const truncatedText = screen.getAllByText(/Please give me admin permissions/)[0];
    //     expect(truncatedText).toBeInTheDocument();

    //     fireEvent.click(truncatedText);
    //     expect(screen.getByText("Full Request Text")).toBeInTheDocument();
    //     expect(screen.getByText(/Please give me admin permissions/)).toBeInTheDocument();

    //     fireEvent.click(screen.getByRole("button", { name: "Close" }));
    //     expect(screen.queryByText("Full Request Text")).not.toBeInTheDocument();
    //   });

    // Modal Confirm button
    test("clicking confirm button opens confirmation modal", () => {
        render(
            <BrowserRouter>
                <AdminTool />
            </BrowserRouter>
        );

        const confirmButton = screen.getAllByText("Confirm")[0];
        fireEvent.click(confirmButton);
        expect(screen.getByText("Confirm Action")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "confirm" })).toBeInTheDocument();
    });

    // Modal Deny button
    test("clicking deny button opens confirmation modal", () => {
        render(
            <BrowserRouter>
                <AdminTool />
            </BrowserRouter>
        );
    
        const denyButton = screen.getAllByText("Deny")[0];
        fireEvent.click(denyButton);
        expect(screen.getByText("Confirm Action")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "confirm" })).toBeInTheDocument();
    });


});    